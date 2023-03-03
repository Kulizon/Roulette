import { useSelector } from "react-redux";

import styles from "./Games.module.scss";

import Roulette from "./Roulette/Roulette";
import Crash from "./Crash/Crash";
import { RootState } from "../../store";

const Games = () => {
  const game = useSelector((state: RootState) => state.user.game);

  return (
    <div className={styles.games}>
      {game === "crash" && <Crash></Crash>}
      {game === "roulette" && <Roulette></Roulette>}
    </div>
  );
};

export default Games;
