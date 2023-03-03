export interface Bet {
  amount: number;
  id: string;
  roundID: string;
  userID: string;
  userImage: string;
  username: string;
  type: "roulette" | "crash";
}

export interface RouletteBet extends Bet {
  number: number;
}

export interface CrashBet extends Bet {
  stoppedAt: number;
}
