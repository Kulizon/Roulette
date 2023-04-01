import { useEffect, useState } from "react";
import { socket } from "../../../../index";
import { RouletteRound } from "../../../../types/Rounds";

import styles from "./RouletteHistory.module.scss";

import chip1 from "./../../../../resources/chip1.png";
import chip2 from "./../../../../resources/chip2.png";
import chip3 from "./../../../../resources/chip3.png";

const RouletteHistory = () => {
  const [history, setHistory] = useState<RouletteRound[]>([]);

  useEffect(() => {
    if (!socket) return;
    socket.emit("getRouletteHistory");

    socket.on(
      "rouletteHistoryUpdated",
      (newHistory: RouletteRound[], isInitial: boolean) => {
        const timeoutLength = isInitial ? 10 : 3000;
        setTimeout(() => {
          setHistory(newHistory.reverse());
        }, timeoutLength);
      }
    );

    return () => {
      if (!socket) return;
      socket.removeListener("rouletteHistoryUpdated");
    };
  }, []);

  return (
    <div className={styles["roulette-history"]}>
      <span>LAST GAME</span>
      {history.map((round) => (
        <img
          key={round.id}
          src={
            round.winningNumber % 2 === 0
              ? chip1
              : round.winningNumber === -1
              ? chip2
              : chip3
          }
          alt="last round"
        ></img>
      ))}
    </div>
  );
};

export default RouletteHistory;
