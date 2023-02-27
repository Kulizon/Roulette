import { RouletteBet } from "./RouletteBet";

export interface RouletteRound {
  bets: RouletteBet[];
  id: string;
  winningNumber: number;
}
