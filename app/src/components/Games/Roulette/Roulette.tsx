import { socket } from "../../../index";
import { useTimer } from "react-timer-hook";
import { useEffect } from "react";

import RouletteSpinner from "./RouletteSpinner/RouletteSpinner";
import RouletteHistory from "./RouletteHistory/RouletteHistory";
import BetForm from "./../../UI/BetForm/BetForm";
import RouletteCurrentBets from "./RouletteCurrentBets/RouletteCurrentBets";

import styles from "./Roulette.module.scss";

const ROULETTE_ANIMATION_LENGTH = 3000;
const BETTING_PAUSE_ROULETTE = 8000;

const Roulette = () => {
  const { seconds, isRunning, restart } = useTimer({
    expiryTimestamp: new Date(),
  });

  useEffect(() => {
    if (!socket) return;
    socket.on("openRouletteBets", () => {
      setTimeout(() => {
        const time = new Date();
        restart(
          time.setSeconds(
            time.getSeconds() + BETTING_PAUSE_ROULETTE / 1000
          ) as unknown as Date
        );
      }, ROULETTE_ANIMATION_LENGTH);
    });

    return () => {
      if (!socket) return;
      socket.removeListener("openRouletteBets");
    };
  }, []);

  return (
    <div className={styles.roulette}>
      <RouletteHistory></RouletteHistory>
      <RouletteSpinner></RouletteSpinner>
      <BetForm type="roulette" timeLeft={seconds}></BetForm>
      <RouletteCurrentBets></RouletteCurrentBets>
    </div>
  );
};

export default Roulette;
