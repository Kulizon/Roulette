import { useEffect, useState } from "react";
import { socket } from "../../../../index";
import { RouletteBet } from "../../../../types/Bets";

import BetList from "./BetList/BetList";

import styles from "./RouletteCurrentBets.module.scss";

const RouletteCurrentBets = () => {
  const [userBets, setUserBets] = useState<RouletteBet[]>([]);

  useEffect(() => {
    socket.emit("getCurrentRouletteBets");

    socket.on(
      "currentRouletteBetsUpdated",
      (userBets: RouletteBet[], isTimeout) => {
        setTimeout(
          () => {
            setUserBets(userBets);
          },
          isTimeout ? 3000 : 10
        );
      }
    );

    return () => {
      socket.removeListener("currentRouletteBetsUpdated");
    };
  }, []);

  const evenNumbers = userBets.filter((b) => b.number % 2 === 0);
  const oddNumbers = userBets.filter((b) => b.number % 2 === 1);
  const specialNumbers = userBets.filter((b) => b.number === -1);

  return (
    <div className={styles["user-bets"]}>
      <BetList list={evenNumbers} type="e"></BetList>
      <BetList type="s" list={specialNumbers}></BetList>
      <BetList list={oddNumbers} type="o"></BetList>
    </div>
  );
};

export default RouletteCurrentBets;
