import { useEffect, useState } from "react";
import { socket } from "../../../../index";
import { CrashRound } from "../../../../types/Rounds";

import styles from "./CrashHistory.module.scss";

const CrashHistory = () => {
  const [history, setHistory] = useState<CrashRound[]>([]);

  useEffect(() => {
    socket.emit("getCrashHistory");

    socket.on("crashHistoryUpdated", (newHistory: CrashRound[]) => {
      setHistory(newHistory.reverse());
    });

    return () => {
      socket.removeListener("crashHistoryUpdated");
    };
  }, []);

  return (
    <ul className={styles.history}>
      <h4>
        LAST GAME <span>x{history[0]?.stoppedAt.toFixed(2)}</span>
      </h4>
      <ul>
        {[...history].splice(1, history.length - 1).map((round) => (
          <li key={round.id}>x{round.stoppedAt.toFixed(2)}</li>
        ))}
      </ul>
    </ul>
  );
};

export default CrashHistory;
