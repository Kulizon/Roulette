import { useEffect, useState } from "react";
import { socket } from "../../../../index";
import { RouletteBet } from "../../../../types/RouletteBet";

import styles from "./RouletteCurrentBets.module.scss";

const RouletteCurrentBets = () => {
  const [userBets, setUserBets] = useState<RouletteBet[]>([]);

  useEffect(() => {
    socket.on("currentBetsUpdated", (userBets: RouletteBet[]) => {
      setUserBets(userBets);
    });
  }, []);

  const evenNumbers = userBets.filter((b) => b.number % 2 === 0);
  const oddNumbers = userBets.filter((b) => b.number % 2 === 1);

  return (
    <div className={styles["user-bets"]}>
      <div>
        Even:{" "}
        {evenNumbers.map((bet) => (
          <span key={bet.id}>{bet.userID}</span>
        ))}
      </div>
      <div>
        Odd:{" "}
        {oddNumbers.map((bet) => (
          <span key={bet.id}>{bet.userID}</span>
        ))}
      </div>
    </div>
  );
};

export default RouletteCurrentBets;
