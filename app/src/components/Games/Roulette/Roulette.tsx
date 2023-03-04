import { socket } from "../../../index";
import { useTimer } from "react-timer-hook";
import { useEffect } from "react";

import RouletteSpinner from "./RouletteSpinner/RouletteSpinner";
import RouletteHistory from "./RouletteHistory/RouletteHistory";
import BetForm from "./../../UI/BetForm/BetForm";
import RouletteCurrentBets from "./RouletteCurrentBets/RouletteCurrentBets";

import styles from "./Roulette.module.scss";

const Roulette = () => {
  const { seconds, isRunning, restart } = useTimer({
    expiryTimestamp: new Date(),
    onExpire: () => console.warn("onExpire called"),
  });

  useEffect(() => {
    socket.on("openRouletteBets", () => {
      setTimeout(() => {
        const time = new Date();
        restart(time.setSeconds(time.getSeconds() + 4) as unknown as Date);
      }, 3000);
    });

    return () => {
      socket.removeListener("openRouletteBets");
    };
  }, []);

  console.log(seconds);

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
