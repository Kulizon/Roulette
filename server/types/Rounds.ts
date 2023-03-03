import { RouletteBet, CrashBet } from "./Bets";

export interface RouletteRound {
  rouletteBets: RouletteBet[];
  id: string;
  winningNumber: number;
}

export interface CrashRound {
  crashBets: CrashBet[];
  id: string;
  stoppedAt: number;
}
