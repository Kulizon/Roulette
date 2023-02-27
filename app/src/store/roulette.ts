import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RouletteBet } from "../types/RouletteBet";
import { nanoid } from "nanoid";
import {RouletteRound} from "../types/RouletteRound";

interface RouletteRoundArchived extends RouletteRound {
  pot: number;
}

const initialState: {
  bets: RouletteBet[];
  currentRoundID: string;
  winningNumber: number;
  history: RouletteRoundArchived[];
  isOpen: boolean;
  balance: number;
} = {
  bets: [],
  currentRoundID: "",
  winningNumber: -1,
  history: [],
  isOpen: true,
  balance: 1000,
};

export const rouletteSlice = createSlice({
  name: "roulette",
  initialState: initialState,
  reducers: {
    // changeRound: (state) => {
    //   const oldRound: RouletteRoundArchived = {
    //     id: state.currentRoundID,
    //     bets: [...state.bets],
    //     winningNumber: state.winningNumber,
    //     pot: state.bets.reduce((prevAmount, bet) => prevAmount + bet.amount, 0),
    //   };
    //   state.isOpen = true;
    //   if (state.history.length === 10) {
    //     state.history = [...state.history.slice(1)];
    //   }
    //   if (state.currentRoundID !== "")
    //     state.history = [...state.history, oldRound];
    //   // generate ID here
    //   state.currentRoundID = nanoid();
    //   state.bets = [];
    //   state.winningNumber = -1;
    // },
    // closeBets: (state) => {
    //   state.isOpen = false;
    // },
    // setCurrentRoundWinningNumber: (state, action: PayloadAction<number>) => {
    //   const winningNumber = action.payload;
    //   state.winningNumber = winningNumber;
    //   state.bets.forEach((bet) => {
    //     if (bet.number % 2 === winningNumber % 2 && state.bets.length > 0) {
    //       state.balance += state.bets[0].amount * 2;
    //     }
    //   });
    // },
    // addBet: (state, action: PayloadAction<RouletteBet>) => {
    //   state.balance -= action.payload.amount;
    //   state.bets = [...state.bets, action.payload];
    // },
    // removeBet: (state, action: PayloadAction<String>) => {
    //   state.balance += state.bets[0].amount;
    //   state.bets = [...state.bets.filter((bet) => bet.id !== action.payload)];
    // },
  },
});

// Action creators are generated for each case reducer function
// export const {
//   addBet,
//   changeRound,
//   setCurrentRoundWinningNumber,
//   removeBet,
//   closeBets,
// } = rouletteSlice.actions;

export default rouletteSlice.reducer;
