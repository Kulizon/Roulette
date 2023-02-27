import { RouletteSpan } from "./types/RouletteSpan";
import { RouletteBet } from "./types/RouletteBet";
import { RouletteRound } from "./types/RouletteRound";
import serv from "http";

const http = serv.createServer();
import { Server } from "socket.io";
import { clearInterval } from "timers";
import { nanoid } from "nanoid";

const io = new Server(http, {
  cors: { origin: "*" },
});

let connections: { id: string; balance: number }[] = [];
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
      const user = connections.find((c) => c.id == bet.userID);
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

  connections.push({ id: socket.id, balance: 1000 });

  if (timeTillSpin >= 1000) {
    setTimeout(() => {
      io.emit("spans", {
        spans: spans,
        winner: winner,
        isInitial: true,
      });
    }, 250);
  }

  socket.on("newBet", (newBet: RouletteBet) => {
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

    const user = connections.find((c) => c.id == socket.id);

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

  socket.on("cancelBet", (bet: RouletteBet) => {
    let userAlreadyPlacedBet = false;
    bets.forEach((b) => {
      if (b.userID === socket.id) {
        userAlreadyPlacedBet = true;
      }
    });

    const user = connections.find((c) => c.id == socket.id);

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

    connections = connections.filter((s) => s.id !== socket.id);
  });
});

http.listen(8080, () => {
  console.log("Server started on port 8080");
});
