import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { socket } from "../../index";
import { RootState } from "../../store";
import { changeGame, changeUser } from "../../store/user";
import { toast } from "react-toastify";

import styles from "./Menu.module.scss";
import crystalPng from "./../../resources/crystal.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faDiceTwo,
  faArrowTrendUp,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

import LevelDisplay from "./LevelDisplay/LevelDisplay";

const Menu = () => {
  const dispatch = useDispatch();

  const [balance, setBalance] = useState(0);
  const [level, setLevel] = useState(0);
  const { name, image } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (!socket) return;
    socket.on(
      "newUserInfo",
      (data: { balance: number; level: number }, isTimeout) => {
        if (isTimeout) {
          setTimeout(() => {
            if (data.level > level)
              toast.success("Congratulations on leveling up!");
            setBalance(data.balance);
            setLevel(data.level);
          }, 3000);
          return;
        }

        setBalance(data.balance);
        setLevel(data.level);
      }
    );

    return () => {
      if (!socket) return;
      socket.removeListener("newUserInfo");
    };
  }, []);

  return (
    <div className={styles.menu}>
      <div className={styles.navigation}>
        <h2>
          Funny<span>Spin</span>
        </h2>
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

        <FontAwesomeIcon
          icon={faRightFromBracket as IconDefinition}
          className={styles.logout}
          onClick={() => dispatch(changeUser({ jwt: "", name: "", image: "" }))}
        ></FontAwesomeIcon>
      </div>
    </div>
  );
};

export default Menu;
