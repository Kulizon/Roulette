import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { socket } from "../../index";
import { RootState } from "../../store";
import { changeGame } from "../../store/user";

import styles from "./Menu.module.scss";
import crystalPng from "./../../resources/crystal.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faDiceTwo, faArrowTrendUp } from "@fortawesome/free-solid-svg-icons";

import Button from "../UI/Button/Button";
import LevelDisplay from "./LevelDisplay/LevelDisplay";

const Menu = () => {
  const dispatch = useDispatch();

  const [balance, setBalance] = useState(0);
  const [level, setLevel] = useState(0);
  const { name, image } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    socket.on(
      "newUserInfo",
      (data: { balance: number; level: number }, isTimeout) => {
        console.log(data);

        if (isTimeout) {
          setTimeout(() => {
            setBalance(data.balance);
            setLevel(data.level);
          }, 2500);
        } else {
          setBalance(data.balance);
          setLevel(data.level);
        }
      }
    );
  }, []);

  return (
    <div className={styles.menu}>
      <div className={styles.navigation}>
        <span>SoloEmpire</span>
        <div className={styles["navigation-links"]}>
          <a
            onClick={(e: any) => {
              e.preventDefault();
              dispatch(changeGame("roulette"));
            }}
          >
            <FontAwesomeIcon
              icon={faDiceTwo as IconDefinition}
            ></FontAwesomeIcon>
            Roulette
          </a>
          <a
            onClick={(e: any) => {
              e.preventDefault();
              dispatch(changeGame("crash"));
            }}
          >
            <FontAwesomeIcon
              icon={faArrowTrendUp as IconDefinition}
            ></FontAwesomeIcon>
            Crash
          </a>
        </div>
      </div>

      <div className={styles["profile-info"]}>
        <div className={styles["balance"]}>
          <img src={crystalPng}></img> <span>{balance}</span>
        </div>
        {/* <Button>Deposit</Button> */}
        <LevelDisplay level={level}></LevelDisplay>
        <div>
          {name}
          <img src={image} alt="Profile"></img>
        </div>
      </div>
    </div>
  );
};

export default Menu;
