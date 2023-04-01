import { useState, useEffect, useRef } from "react";
import { CrashBet, RouletteBet, Bet } from "../../../types/Bets";
import { socket } from "../../../index";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { toast } from "react-toastify";

import styles from "./BetForm.module.scss";
import crystalPng from "./../../../resources/crystal.png";
import chip1 from "./../../../resources/chip1.png";
import chip2 from "./../../../resources/chip2.png";
import chip3 from "./../../../resources/chip3.png";

import Button from "../Button/Button";

const BetForm = (props: {
  type: "roulette" | "crash";
  currentCrashValue?: number;
  timeLeft: number;
}) => {
  const [placedBet, setPlacedBet] = useState<RouletteBet | null | CrashBet>(
    null
  );
  const [selectedBet, setSelectedBet] = useState<"o" | "s" | "e" | "">("");
  const [isOpen, setIsOpen] = useState(false);
  const [balance, setBalance] = useState(0);
  const betInputRef = useRef<HTMLInputElement>(null);

  const jwt = useSelector((state: RootState) => state.user.jwt);

  const placeBetHandler = (e: any) => {
    e.preventDefault();

    if (!jwt) {
      toast.error("Login!");
      return;
    }

    if (!socket) return;

    if (e.nativeEvent.submitter.id === "stop") {
      socket.emit("stopCrash", placedBet, jwt, props.currentCrashValue);
      return;
    }

    if (!isOpen && e.nativeEvent.submitter.id === "bet") {
      toast.error("Bets closed. Wait for the next round!");
      return;
    }

    if (e.nativeEvent.submitter.id === "bet") {
      const amount = +betInputRef.current!.value;

      if (!selectedBet && props.type === "roulette") {
        toast.error("Please choose what to bet on!");
        return;
      }

      if (amount < 1 && amount >= balance) {
        toast.error("Invalid amount!");
        return;
      }

      const newBet: Bet | RouletteBet = {
        amount: amount,
        roundID: "",
        id: "",
        userID: socket.id,
        userImage: "",
        username: "",
        type: props.type,
      };

      if (props.type === "roulette")
        (newBet as RouletteBet).number =
          selectedBet === "e" ? 2 : selectedBet === "o" ? 1 : -1;

      if (props.type === "crash") (newBet as CrashBet).stoppedAt = -1;

      // send newBet
      socket.emit("newBet", newBet, jwt);

      betInputRef.current!.value = "";
      e.target[0].checked = false;
      e.target[1].checked = false;
      e.target[2].checked = false;
      setSelectedBet("");
    } else if (e.nativeEvent.submitter.id === "cancel") {
      socket.emit("cancelBet", placedBet, jwt);
    }
  };

  useEffect(() => {
    if (!socket) return;
    socket.on("betIsValid", (bet: RouletteBet) => {
      setPlacedBet(bet);
    });

    socket.on("betIsInvalid", () => {
      toast.error("Bet was invalid... try again!");
    });

    socket.on("cancelSuccess", (bet: RouletteBet) => {
      setPlacedBet(null);
    });

    socket.on("cancelFailure", () => {
      toast.error("Cancel failed... try again!");
    });

    socket.on(
      "newUserInfo",
      (data: { balance: number; level: number }, isTimeout) => {
        if (isTimeout) {
          setTimeout(() => {
            setBalance(data.balance);
          }, 3000); // animation length
        } else setBalance(data.balance);
      }
    );

    if (props.type === "roulette") {
      socket.on("spans", () => {
        setPlacedBet(null);
      });

      socket.on("closeRouletteBets", () => {
        setIsOpen(false);
      });

      socket.on("openRouletteBets", () => {
        setTimeout(() => {
          setIsOpen(true);
        }, 3000); // animation length
      });
    }

    if (props.type === "crash") {
      socket.on("crashed", () => {
        setPlacedBet(null);
      });

      socket.on("closeCrashBets", () => {
        setIsOpen(false);
      });

      socket.on("openCrashBets", () => {
        setIsOpen(true);
      });

      socket.on("stopCrashFailed", () => {
        toast.error("Stopping failed... try again!");
      });

      socket.on("stopCrashSuccess", () => {
        setPlacedBet(null);
      });
    }

    return () => {
      if (!socket) return;
      socket.removeListener("betIsValid");
      socket.removeListener("betIsInvalid");
      socket.removeListener("cancelSuccess");
      socket.removeListener("cancelFailure");
      socket.removeListener("spans");
      socket.removeListener("closeRouletteBets");
      socket.removeListener("openRouletteBets");

      socket.removeListener("closeCrashBets");
      socket.removeListener("openCrashBets");
      socket.removeListener("stopCrashSuccess");
      socket.removeListener("stopCrashFailed");
      socket.removeListener("crashed");
    };
  }, [props.type]);

  return (
    <form onSubmit={placeBetHandler} className={styles.form}>
      <h3
        className={`${styles.timer} ${
          props.timeLeft === 0 ? styles.hidden : ""
        }`}
      >
        Bets closing in {props.timeLeft}
      </h3>

      <div className={styles["bet-input"]}>
        {props.type === "roulette" && (
          <div
            className={styles.radio}
            onChange={(e: any) => {
              setSelectedBet(e.target.value);
            }}
          >
            <div>
              <input type="radio" id="even" value="e" name="bet" />
              <label htmlFor="even">
                <img src={chip1} alt="Chip1" />
              </label>
            </div>

            <div>
              <input type="radio" id="special" value="s" name="bet" />
              <label htmlFor="special">
                <img src={chip2} alt="Chip2" />
              </label>
            </div>

            <div>
              <input type="radio" id="odd" value="o" name="bet" />
              <label htmlFor="odd">
                <img src={chip3} alt="Chip3" />
              </label>
            </div>
          </div>
        )}
        <div className={styles["value-buttons"]}>
          <button
            id="add-10"
            onClick={() =>
              (betInputRef.current!.value = (
                +betInputRef.current!.value + 10
              ).toString())
            }
          >
            +10
          </button>
          <button
            id="add-100"
            onClick={() =>
              (betInputRef.current!.value = (
                +betInputRef.current!.value + 100
              ).toString())
            }
          >
            +100
          </button>
          <button
            id="double-down"
            onClick={() =>
              (betInputRef.current!.value = Math.floor(
                +betInputRef.current!.value / 2
              ).toString())
            }
          >
            1/2x
          </button>
          <button
            id="double-up"
            onClick={() =>
              (betInputRef.current!.value = (
                +betInputRef.current!.value * 2
              ).toString())
            }
          >
            2x
          </button>
          <button
            id="triple-up"
            onClick={() =>
              (betInputRef.current!.value = (
                +betInputRef.current!.value * 3
              ).toString())
            }
          >
            3x
          </button>
          <button
            id="max"
            onClick={() => (betInputRef.current!.value = balance.toString())}
          >
            MAX
          </button>
        </div>
        <span>
          <img src={crystalPng}></img>
        </span>
        <input type="number" min={0} ref={betInputRef} />
      </div>
      <div className={styles["control-buttons"]}>
        <Button
          id={props.type === "crash" && !isOpen && placedBet ? "stop" : "bet"}
          disabled={
            (!isOpen || (placedBet as unknown as boolean)) &&
            !(props.type === "crash" && !isOpen && placedBet)
          }
        >
          {props.type === "crash" && !isOpen && placedBet ? "Stop" : "Bet"}
        </Button>
        <Button
          id="cancel"
          disabled={!isOpen || (!placedBet as unknown as boolean)}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default BetForm;
