import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: {
  jwt: string;
} = {
  jwt: "",
};

export const userSlice = createSlice({
  name: "roulette",
  initialState: initialState,
  reducers: {
    changeToken: (state, action: PayloadAction<string>) => {
      state.jwt = action.payload;
    },
  },
});


export const { changeToken } = userSlice.actions;

export default userSlice.reducer;
