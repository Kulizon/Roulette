import { socket } from "../../../index";
import { useEffect, useState } from "react";

import styles from "./Crash.module.scss";

import BetForm from "./../../UI/BetForm/BetForm";
import CrashHistory from "./CrashHistory/CrashHistory";
import CrashCurrentBets from "./CrashCurrentBets/CrashCurrentBets";

const Crash = () => {
  const [crashValue, setCrashValue] = useState<number>(1);
  const [isCrashed, setIsCrashed] = useState(false);

  useEffect(() => {
    socket.on("newCrashValue", (newCrashValue: number) => {
      setCrashValue(newCrashValue);
    });

    socket.on("crashed", () => setIsCrashed(true));
    socket.on("openCrashBets", () => setIsCrashed(false));

    return () => {
      socket.removeListener("newCrashValue");
      socket.removeListener("crashed");
    };
  }, []);

  return (
    <div className={styles.crash}>
      <CrashHistory></CrashHistory>
      <div className={styles.main}>
        <div className={styles["crash-value"]}>
          {isCrashed && <span className={styles.crashed}>Crashed!</span>}
          <span> x{crashValue.toFixed(2)}</span>
        </div>

        {!isCrashed && (
          <div className={styles["lds-default"]}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        )}
      </div>
      <BetForm type="crash" currentCrashValue={crashValue}></BetForm>
      <CrashCurrentBets></CrashCurrentBets>
    </div>
  );
};

export default Crash;
