import { useEffect, useState } from "react";
import { socket } from "../../../../index";
import { RouletteRound } from "../../../../types/RouletteRound";

import styles from "./RouletteHistory.module.scss";

const RouletteHistory = () => {
  const [history, setHistory] = useState<RouletteRound[]>([]);

  useEffect(() => {
    socket.on("historyUpdated", (history: RouletteRound[]) => {
      setTimeout(() => {
        setHistory(history);
      }, 2500);
    });
  }, []);

  return (
    <div className={styles["roulette-history"]}>
      {history.map((round) => (
        <div key={round.id}>
          <span>{round.winningNumber}</span>
          <p>
            Pot: {round.bets.reduce((sum, next) => (sum += next.amount), 0)}
          </p>
        </div>
      ))}
    </div>
  );
};

export default RouletteHistory;
