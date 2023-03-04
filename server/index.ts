import { RouletteSpan } from "./types/RouletteSpan";
import { RouletteBet, CrashBet, Bet } from "./types/Bets";
import { CrashRound, RouletteRound } from "./types/Rounds";
import fetch from "node-fetch";
import serv from "http";

const http = serv.createServer();
import { Server } from "socket.io";
import { clearInterval } from "timers";
import { nanoid } from "nanoid";

var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const io = new Server(http, {
  cors: { origin: "*" },
});

interface User {
  name: string;
  email: string;
  balance: number;
  googleID: string;
  id: string;
  socketID: string;
  jwt: string;
  image: string;
  level: number;
}

let loggedInUsers: User[] = [];
let connections: string[] = [];

let rouletteBets: RouletteBet[] = [];
let rouletteHistory: RouletteRound[] = [];

let crashBets: CrashBet[] = [];
let crashHistory: CrashRound[] = [];

let spans: RouletteSpan[] = [];
let winner = 0;
let currentRouletteRoundID = "";
let currentCrashRoundID = "";

let rouletteBetsOpen = false;
let crashBetsOpen = false;
let crashRunning = false;
let crashValue = 1;

////////////////////////////////////// Roulette

const ANIMATION_LENGTH = 3000;
const BETTING_PAUSE_ROULETTE = 4000;

const rouletteLoop = async () => {
  await runRouletteRound();

  setTimeout(() => {
    rouletteBetsOpen = true;
  }, ANIMATION_LENGTH); // animation

  setTimeout(() => {
    rouletteLoop();
  }, ANIMATION_LENGTH + BETTING_PAUSE_ROULETTE);
};

const runRouletteRound = () => {
  return new Promise((resolve) => {
    io.emit("closeRouletteBets");
    rouletteBetsOpen = false;
    const numberOfRandomSpans = Math.floor(Math.random() * 20 + 45);
    // might need to change later

    let newRandomSpans: RouletteSpan[] = [];
    // adds n spans
    let i = 0;

    while (i < numberOfRandomSpans) {
      const r = Math.floor(Math.random() * 20 + -1);
      const newSpan = {
        number: r,
      };
      newRandomSpans.push(newSpan);
      i++;
    }

    spans = newRandomSpans;
    winner = Math.floor(Math.random() * 20 + 20);

    // emit "win" event to every socket that won

    rouletteBets.forEach(async (bet) => {
      if (bet.number % 2 == spans[winner].number % 2) {
        io.to(bet.userID).emit("win");
        const user = loggedInUsers.find((c) => c.socketID == bet.userID);

        if (!user) return;

        updateUser(
          user,
          bet,
          bet.number != -1 ? bet.amount * 2 : bet.amount * 30,
          io.to(bet.userID),
          0.1,
          true
        );
      }
    });

    // currentRoundID = nanoid();
    io.sockets.emit("spans", {
      spans: spans,
      winner: winner,
    });

    // add to rouletteHistory
    const oldRound = {
      id: currentRouletteRoundID,
      rouletteBets: rouletteBets,
      winningNumber: spans[winner].number,
    };

    rouletteHistory.push(oldRound);

    if (rouletteHistory.length === 11) rouletteHistory.shift();

    rouletteBets = [];
    currentRouletteRoundID = nanoid();

    io.emit("openRouletteBets");
    crashBetsOpen = true;
    io.emit("currentRouletteBetsUpdated", rouletteBets, true);
    io.emit("rouletteHistoryUpdated", rouletteHistory);
    resolve("");
  });
};

////////////////////////////////////// Crash

const BETTING_PAUSE = 3000;
const AFTER_ROUND_PAUSE = 3000;

const crashLoop = async () => {
  const waitValue = await runCrashRound();

  setTimeout(() => {
    crashLoop();
  }, BETTING_PAUSE + AFTER_ROUND_PAUSE + waitValue);
};

const runCrashRound: () => Promise<number> = () => {
  return new Promise((resolve) => {
    io.emit("closeCrashBets");
    crashBetsOpen = false;
    crashRunning = true;

    const stopsAfter = Math.random() * 10000 + 2000;
    let i = 1;

    const crashInterval = setInterval(() => {
      crashValue = parseFloat((crashValue + (2 ^ i) / 100).toFixed(2));
      i += 0.001;
      io.emit("newCrashValue", crashValue);
    }, 50 - (2 ^ i) / 100);

    setTimeout(() => {
      clearInterval(crashInterval);
      crashRunning = false;
      // send data
      io.emit("crashed", crashValue);

      currentCrashRoundID = nanoid();
      const oldRound: CrashRound = {
        id: currentCrashRoundID,
        crashBets: crashBets,
        stoppedAt: crashValue,
      };

      crashHistory.push(oldRound);

      if (crashHistory.length === 11) crashHistory.shift();

      currentCrashRoundID = nanoid();

      crashBetsOpen = true;
      crashBets = [...crashBets].map((b) => {
        return { ...b, stoppedAt: crashValue };
      });
      io.emit("currentCrashBetsUpdated", crashBets);
      io.emit("crashHistoryUpdated", crashHistory);

      crashBets = [];
      crashValue = 1;
      setTimeout(() => {
        io.emit("openCrashBets");
        io.emit("currentCrashBetsUpdated", crashBets);
        io.emit("newCrashValue", crashValue);
      }, AFTER_ROUND_PAUSE);
    }, stopsAfter);

    resolve(stopsAfter);

    // settimeout according to stops at
    // after some time io.emit("crashed")
    // remove all crash bets
    // listen to socket.on('stop crash') and give users their credits when clicked
  });
};

setTimeout(() => {
  rouletteLoop();
  crashLoop();
}, 1000);

io.on("connection", (socket: any) => {
  console.log("user connected");

  connections.push(socket.id);

  if (rouletteBetsOpen) {
    // initial load in
    setTimeout(() => {
      socket.emit("spans", {
        spans: spans,
        winner: winner,
        isInitial: true,
      });
    }, 250);
  }

  socket.emit("currentRouletteBetsUpdated", rouletteBets, true);
  socket.emit("rouletteHistoryUpdated", rouletteHistory, true);

  socket.emit("currentCrashBetsUpdated", crashBets, true);
  socket.emit("crashHistoryUpdated", crashHistory, true);

  socket.on("login", async (jwt: string) => {
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${jwt}`,
      { method: "POST" }
    );

    const result = await response.json();

    if (result.email) {
      const googleID = result.sub;

      const query = await db
        .collection("users")
        .where("external_id", "==", googleID)
        .get();

      if (query.empty) {
        const newUserID = nanoid();
        const res = await db.collection("users").doc(newUserID).set({
          name: result.name,
          email: result.email,
          balance: 1000,
          level: 1,
          external_id: googleID,
        });

        if (res) {
          const user = {
            name: result.name,
            email: result.email,
            balance: 1000,
            googleID: googleID,
            id: newUserID,
            socketID: socket.id,
            jwt: jwt,
            image: result.picture,
            level: 1,
          };

          loggedInUsers.push(user);
          socket.emit("loginSuccess", user);
          socket.emit("newUserInfo", { balance: 1000, level: 1 });
        } else {
          socket.emit("loginFailure");
        }
      } else {
        const user = {
          name: result.name,
          email: result.email,
          balance: query.docs[0].data().balance, // get from db later
          googleID: googleID,
          id: query.docs[0].id,
          socketID: socket.id,
          jwt: jwt,
          image: result.picture,
          level: query.docs[0].data().level,
        };

        loggedInUsers.push(user);

        socket.emit("loginSuccess", user);
        socket.emit("newUserInfo", {
          balance: query.docs[0].data().balance,
          level: query.docs[0].data().level,
        });
      }
    } else {
      socket.emit("loginFailure");
    }
  });

  socket.on("getSpans", () => {
    socket.emit("spans", {
      spans: spans,
      winner: winner,
      isInitial: true,
    });
  });

  socket.on("getRouletteHistory", () => {
    socket.emit("rouletteHistoryUpdated", rouletteHistory, true);
  });

  socket.on("getCurrentRouletteBets", () => {
    socket.emit("currentRouletteBetsUpdated", rouletteBets);
  });

  socket.on("getCrashHistory", () => {
    socket.emit("crashHistoryUpdated", crashHistory);
  });

  socket.on("newBet", async (newBet: RouletteBet | CrashBet, jwt: string) => {
    const bet = { ...newBet };
    bet.roundID = currentRouletteRoundID;
    bet.id = nanoid();

    // check if bet is valid

    let userAlreadyPlacedBet = false;
    const arr = newBet.type === "roulette" ? rouletteBets : crashBets;
    arr.forEach((b) => {
      if (b.userID === socket.id) {
        userAlreadyPlacedBet = true;
      }
    });

    const user = loggedInUsers.find((user) => user.jwt === jwt);

    if (newBet.amount > 0 && !userAlreadyPlacedBet && user) {
      if (
        newBet.type === "roulette" &&
        ((newBet as RouletteBet).number < -1 ||
          (newBet as RouletteBet).number > 29)
      )
        return;
      // bet is valid
      bet.username = user.name;
      bet.userImage = user.image;

      const res = await db
        .collection("users")
        .doc(user.id)
        .update({
          balance: user.balance - bet.amount,
        });

      // check if succesfull
      if (res) {
        user.balance -= bet.amount;

        if (bet.type === "roulette") {
          rouletteBets.push(bet as RouletteBet);
          io.emit("currentRouletteBetsUpdated", rouletteBets);
        }

        if (bet.type === "crash") {
          crashBets.push(bet as CrashBet);
          console.log("hrere");

          io.emit("currentCrashBetsUpdated", crashBets);
        }

        socket.emit("betIsValid", bet);
        socket.emit("newUserInfo", {
          balance: user?.balance,
          level: user.level,
        });
      } else {
        socket.emit("betIsInvalid");
      }
    } else {
      socket.emit("betIsInvalid");
    }

    console.log(rouletteBets);
  });

  socket.on("cancelBet", async (bet: RouletteBet, jwt: string) => {
    let userAlreadyPlacedBet = false;

    const arr = bet.type === "roulette" ? rouletteBets : crashBets;
    arr.forEach((b) => {
      if (b.userID === socket.id) {
        userAlreadyPlacedBet = true;
      }
    });

    const user = loggedInUsers.find((user) => user.jwt == jwt);
    if (
      bet.type === "roulette" &&
      rouletteBetsOpen &&
      userAlreadyPlacedBet &&
      user
    ) {
      rouletteBets = [...rouletteBets.filter((b) => bet.id != b.id)];
      await updateUser(user, bet, bet.amount, socket);
      socket.emit("cancelSuccess", bet);
      io.emit("currentRouletteBetsUpdated", rouletteBets);
    }

    if (bet.type === "crash" && crashBetsOpen && userAlreadyPlacedBet && user) {
      crashBets = [...crashBets.filter((b) => bet.id != b.id)];
      await updateUser(user, bet, bet.amount, socket);
      socket.emit("cancelSuccess", bet);
      io.emit("currentCrashBetsUpdated", crashBets);
    }

    socket.emit("cancelFailure", bet);
  });

  socket.on(
    "stopCrash",
    async (userBet: CrashBet, jwt: string, currentCrashValue: number) => {
      const user = loggedInUsers.find((u) => u.jwt === jwt);
      let userPlacedBet = crashBets.find((b) => {
        if (b.userID === userBet.userID && b.stoppedAt === -1) return true;
        else return false;
      });

      if (currentCrashValue > crashValue) {
        console.log("Cheater!");
        socket.emit("stopCrashFailed");
        return;
      }
      if (user && crashRunning && userPlacedBet) {
        const bet = crashBets.find((b) => b.userID === userBet.userID);
        bet!.stoppedAt = currentCrashValue;

        await updateUser(
          user,
          userBet,
          crashValue * userBet.amount,
          socket,
          0.1
        );

        socket.emit("stopCrashSuccess");
        io.emit("currentCrashBetsUpdated", crashBets);
      } else {
        socket.emit("stopCrashFailed");
      }
    }
  );

  socket.once("disconnect", function () {
    console.log("user disconnected");

    connections = connections.filter((c) => c !== socket.id);
    // loggedInUsers = loggedInUsers.filter((user) => user.socketID !== socket.id);
  });
});

http.listen(8080, () => {
  console.log("Server started on port 8080");
});

// change later !!!!!!!!!!!
const updateUser = async (
  user: User,
  bet: RouletteBet | CrashBet,
  amount: number,
  socket: any,
  levelValue?: number,
  waitBeforeUpdate?: boolean
) => {
  const res = await db
    .collection("users")
    .doc(user.id)
    .update({
      balance: parseFloat((user.balance + amount).toFixed(2)),
      level: parseFloat(
        (user.level + (levelValue ? levelValue : 0)).toFixed(2)
      ),
    });

  if (res) {
    user.balance = parseFloat((user.balance + amount).toFixed(2));
    user.level = parseFloat(
      (user.level + (levelValue ? levelValue : 0)).toFixed(2)
    );
    socket.emit(
      "newUserInfo",
      {
        balance: user.balance,
        level: user.level,
      },
      waitBeforeUpdate
    );
    return true;
  } else {
    return false;
  }
};
