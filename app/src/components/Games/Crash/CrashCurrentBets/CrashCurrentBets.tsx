import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { socket } from "../../../../index";
import { CrashBet } from "../../../../types/Bets";

import styles from "./CrashCurrentBets.module.scss";
import crystalPng from "./../../../../resources/crystal.png";

const CrashCurrentBets = () => {
  const [userBets, setUserBets] = useState<CrashBet[]>([]);

  useEffect(() => {
    socket.emit("getCurrentCrashBets");

    socket.on("currentCrashBetsUpdated", (userBets: CrashBet[]) => {
      setUserBets(userBets);
    });

    return () => {
      socket.removeListener("currentCrashBetsUpdated");
    };
  }, []);

  return (
    <div className={styles["user-bets"]}>
      <div className={styles["user-bets-header"]}>
        <div className={styles["user-bets-users"]}>
          <FontAwesomeIcon icon={faUsers as IconDefinition}></FontAwesomeIcon>
          <span>{userBets.length}</span>
        </div>
        <div className={styles["user-bets-pot"]}>
          <img src={crystalPng}></img>
          <span>{userBets.reduce((sum, bet) => (sum += bet.amount), 0)}</span>
        </div>
      </div>

      <ul>
        {userBets.map((bet) => (
          <li key={bet.id}>
            <div className={styles["user-bets-profile"]}>
              <img src={bet.userImage}></img>
              <span>{bet.username}</span>
            </div>
            {bet.stoppedAt === -1 ? "" : bet.stoppedAt.toFixed(2)}
            <div className={styles["user-bets-pot"]}>
              <img src={crystalPng}></img> <span>{bet.amount}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CrashCurrentBets;
