import { RouletteSpan } from "./types/RouletteSpan";
import { RouletteBet } from "./types/RouletteBet";
import { RouletteRound } from "./types/RouletteRound";
import fetch from "node-fetch";
import serv from "http";

const http = serv.createServer();
import { Server } from "socket.io";
import { clearInterval } from "timers";
import { nanoid } from "nanoid";

const io = new Server(http, {
  cors: { origin: "*" },
});

let loggedInUsers: {
  name: string;
  email: string;
  balance: number;
  jwt: string;
  socketID: string;
}[] = [];
let connections: string[] = [];
let bets: RouletteBet[] = [];
let history: RouletteRound[] = [];

let spans: RouletteSpan[] = [];
let winner = 0;
let currentRoundID = "";

let timeTillSpin = 6000;
let timer: any;

setInterval(() => {
  timeTillSpin = 6000;
  clearInterval(timer);
  timer = setInterval(() => {
    timeTillSpin -= 100;

    if (timeTillSpin <= 1000) io.emit("closeBets");
  }, 100);

  const numberOfRandomSpans = Math.floor(Math.random() * 5 + 20);
  // might need to change later

  // adds n spans
  const newRandomSpans: RouletteSpan[] = [];
  let i = 0;

  while (i < numberOfRandomSpans) {
    const r = Math.floor(Math.random() * 60 + 1);

    if (
      !newRandomSpans.map((s) => s.number).includes(r) &&
      !spans.map((s) => s.number).includes(r)
    ) {
      const newSpan = {
        number: r,
        color: (r % 2 === 0 ? "b" : "r") as "b" | "r",
      };
      newRandomSpans.push(newSpan);
      i++;
    }
  }

  spans = newRandomSpans;
  winner = Math.floor(Math.random() * 5 + 10);

  // emit "win" event to every socket that won

  bets.forEach((bet) => {
    if (bet.number % 2 == spans[winner].number % 2) {
      io.to(bet.userID).emit("win");
      const user = loggedInUsers.find((c) => c.socketID == bet.userID);
      console.log(user);

      if (!user) return;
      user.balance += bet.amount * 2;
      io.to(bet.userID).emit("newUserBalance", user?.balance, true);
    }
  });

  // currentRoundID = nanoid();
  io.sockets.emit("spans", {
    spans: spans,
    winner: winner,
  });

  // add to history
  const oldRound = {
    id: currentRoundID,
    bets: bets,
    winningNumber: spans[winner].number,
  };

  history.push(oldRound);

  if (history.length === 6) history.shift();

  // if longer than 10 than stop

  bets = [];
  currentRoundID = nanoid();

  io.emit("openBets");
  io.emit("currentBetsUpdated", bets);
  io.emit("historyUpdated", history);
}, 6600);

io.on("connection", (socket: any) => {
  console.log("user connected");

  connections.push(socket.id);

  if (timeTillSpin >= 1000) {
    setTimeout(() => {
      io.emit("spans", {
        spans: spans,
        winner: winner,
        isInitial: true,
      });
    }, 250);
  }

  socket.on("login", async (jwt: string) => {
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${jwt}`,
      { method: "POST" }
    );

    const result = await response.json();

    console.log(result);

    if (result.email) {
      loggedInUsers.push({
        name: result.name,
        email: result.email,
        balance: 1000, // get from db later
        jwt: jwt,
        socketID: socket.id,
      });
      socket.emit("loginSuccess", jwt);
    } else {
      socket.emit("loginFailure");
    }
  });

  socket.on("newBet", (newBet: RouletteBet, jwt: string) => {
    const bet = { ...newBet };
    bet.roundID = currentRoundID;
    bet.id = nanoid();

    // check if bet is valid

    let userAlreadyPlacedBet = false;
    bets.forEach((b) => {
      if (b.userID === socket.id) {
        userAlreadyPlacedBet = true;
      }
    });

    const user = loggedInUsers.find((user) => user.jwt === jwt);

    console.log(user);

    if (
      newBet.amount > 0 &&
      newBet.number > 0 &&
      newBet.number < 61 &&
      timeTillSpin > 1000 &&
      !userAlreadyPlacedBet &&
      user
    ) {
      // bet is valid
      user.balance -= bet.amount;

      bets.push(bet);
      socket.emit("betIsValid", bet);
      socket.emit("newUserBalance", user?.balance);
      io.emit("currentBetsUpdated", bets);
    } else {
      socket.emit("betIsInvalid");
    }
  });

  socket.on("cancelBet", (bet: RouletteBet, jwt: string) => {
    let userAlreadyPlacedBet = false;
    bets.forEach((b) => {
      if (b.userID === socket.id) {
        userAlreadyPlacedBet = true;
      }
    });

    const user = loggedInUsers.find((user) => user.jwt == jwt);

    if (timeTillSpin > 1000 && userAlreadyPlacedBet && user) {
      bets = [...bets.filter((b) => bet.id != b.id)];
      socket.emit("cancelSuccess", bet);
      user.balance += bet.amount;
      socket.emit("newUserBalance", user?.balance);
      io.emit("currentBetsUpdated", bets);
    } else {
      socket.emit("cancelFailure", bet);
    }
  });

  socket.once("disconnect", function () {
    console.log("user disconnected");

    connections = connections.filter((c) => c !== socket.id);
    loggedInUsers = loggedInUsers.filter((user) => user.socketID !== socket.id);
  });
});

http.listen(8080, () => {
  console.log("Server started on port 8080");
});
