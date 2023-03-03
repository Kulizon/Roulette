import { RouletteBet } from "../../../../../types/Bets";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

import styles from "./BetList.module.scss";

import chip1 from "./../../../../../resources/chip1.png";
import chip2 from "./../../../../../resources/chip2.png";
import chip3 from "./../../../../../resources/chip3.png";
import crystalPng from "./../../../../../resources/crystal.png";

const BetList = (props: { list: RouletteBet[]; type: "e" | "o" | "s" }) => {
  return (
    <div className={styles.list}>
      <div className={styles["list-header"]}>
        <div className={styles["list-users"]}>
          <img
            src={
              props.type === "e" ? chip1 : props.type === "s" ? chip2 : chip3
            }
          ></img>
          <span>
            <FontAwesomeIcon icon={faUsers as IconDefinition} />
            {props.list.length}
          </span>
        </div>
        <div className={styles["list-pot"]}>
          <img src={crystalPng}></img>
          <span>{props.list.reduce((sum, bet) => (sum += bet.amount), 0)}</span>
        </div>
      </div>
      <ul>
        {props.list.map((bet, i) => (
          <li
            key={bet.id}
            className={i % 2 === 0 ? styles["even"] : styles["odd"]}
          >
            <div className={styles["list-profile"]}>
              <img src={bet.userImage}></img>
              {bet.username}
            </div>
            <div className={styles["list-pot"]}>
              <img src={crystalPng}></img>
              <span>
                {props.list.reduce((sum, bet) => (sum += bet.amount), 0)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BetList;
