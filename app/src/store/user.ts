import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: {
  jwt: string;
  name: string;
  image: string;
  game: string;
} = {
  jwt: "",
  name: "",
  image: "",
  game: window.localStorage.getItem("game")
    ? window.localStorage.getItem("game")!
    : "roulette",
};

export const userSlice = createSlice({
  name: "roulette",
  initialState: initialState,
  reducers: {
    changeGame: (state, action: PayloadAction<"roulette" | "crash">) => {
      state.game = action.payload;
      window.localStorage.setItem("game", action.payload);
    },
    changeUser: (
      state,
      action: PayloadAction<{
        jwt: string;
        name: string;
        image: string;
      }>
    ) => {
      state.jwt = action.payload.jwt;
      state.name = action.payload.name;
      state.image = action.payload.image;
    },
  },
});

export const { changeUser, changeGame } = userSlice.actions;

export default userSlice.reducer;
