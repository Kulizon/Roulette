import { useEffect, useState } from "react";
import { socket } from "../../../../index";
import { RouletteBet } from "../../../../types/Bets";

import BetList from "./BetList/BetList";

import styles from "./RouletteCurrentBets.module.scss";

const RouletteCurrentBets = () => {
  const [userBets, setUserBets] = useState<RouletteBet[]>([]);

  useEffect(() => {
    socket.emit("getCurrentRouletteBets");

    socket.on("currentRouletteBetsUpdated", (userBets: RouletteBet[]) => {
      setUserBets(userBets);
    });

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
      <BetList
        type="s"
        list={[
          ...specialNumbers,
          {
            number: 10,
            amount: 100,
            id: "1",
            userID: "1",
            userImage:
              "https://cdn4.buysellads.net/uu/1/81016/1609783206-authentic-260x200-variation-4.jpg",
            username: "Kacper",
            roundID: "1",
            type: "roulette",
          },
          {
            number: 10,
            amount: 100,
            id: "1",
            userID: "1",
            userImage:
              "https://cdn4.buysellads.net/uu/1/81016/1609783206-authentic-260x200-variation-4.jpg",
            username: "Kacper",
            roundID: "1",
            type: "roulette",
          },
          {
            number: 10,
            amount: 100,
            id: "1",
            userID: "1",
            userImage:
              "https://cdn4.buysellads.net/uu/1/81016/1609783206-authentic-260x200-variation-4.jpg",
            username: "Kacper",
            roundID: "1",
            type: "roulette",
          },
          {
            number: 10,
            amount: 100,
            id: "1",
            userID: "1",
            userImage:
              "https://cdn4.buysellads.net/uu/1/81016/1609783206-authentic-260x200-variation-4.jpg",
            username: "Kacper",
            roundID: "1",
            type: "roulette",
          },
        ]}
      ></BetList>
      <BetList list={oddNumbers} type="o"></BetList>
    </div>
  );
};

export default RouletteCurrentBets;
