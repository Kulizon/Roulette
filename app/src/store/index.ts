import { configureStore } from "@reduxjs/toolkit";
import rouletteReducer from "./roulette";

const store = configureStore({
  reducer: { roulette: rouletteReducer },
});

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
