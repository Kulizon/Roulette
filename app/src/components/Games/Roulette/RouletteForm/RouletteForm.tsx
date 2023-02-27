import { useState, useEffect } from "react";
import { RouletteBet } from "../../../../types/RouletteBet";
import { socket } from "../../../../index";

const RouletteForm = () => {
  const [placedBet, setPlacedBet] = useState<RouletteBet | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [balance, setBalance] = useState(1000);

  const placeBetHandler = (e: any) => {
    e.preventDefault();

    // if (!isOpen) return;

    if (e.nativeEvent.submitter.id === "bet") {
      const number = +e.target[0].value;
      const amount = +e.target[1].value;

      if (number < 1 || number > 60) {
        console.log("Wrong number");
        return;
      }

      if (amount < 1) {
        console.log("Wrong amount");
        return;
      }

      const newBet: RouletteBet = {
        amount: amount,
        number: number,
        roundID: "",
        id: "",
        userID: socket.id,
      };

      // send newBet
      socket.emit("newBet", newBet);

      e.target[0].value = "";
      e.target[1].value = "";
    } else if (e.nativeEvent.submitter.id === "cancel") {
      socket.emit("cancelBet", placedBet);
    }
  };

  useEffect(() => {
    socket.on("betIsValid", (bet: RouletteBet) => {
      // set text or smth
      // prevent ability to bet another one
      // check in backend if there is no bet
      setPlacedBet(bet);
    });

    socket.on("betIsInvalid", () => {
      // set text or smth
    });

    socket.on("cancelSuccess", (bet: RouletteBet) => {
      // set text or smth
      setPlacedBet(null);
    });

    socket.on("cancelFailure", () => {
      // set text or smth
    });

    socket.on("newUserBalance", (newBalance, isTimeout) => {
      if (isTimeout) {
        setTimeout(() => {
          setBalance(newBalance);
        }, 2500);
      } else setBalance(newBalance);
    });

    socket.on("spans", () => {
      setPlacedBet(null);
    });

    socket.on("closeBets", () => {
      setIsOpen(false);
    });

    socket.on("openBets", () => {
      setTimeout(() => {
        setIsOpen(true);
      }, 2500); // animation length
    });
  }, []);

  return (
    <form onSubmit={placeBetHandler}>
      <h3>Your balance is {balance}</h3>
      <div>
        <label>Number</label>
        <input type="number" min={1} max={60} />
      </div>
      <div>
        <label>Amount</label>
        <input type="number" min={0} />
      </div>
      <button id="bet" disabled={!isOpen || (placedBet as unknown as boolean)}>
        Bet
      </button>
      <button
        id="cancel"
        disabled={!isOpen || (!placedBet as unknown as boolean)}
      >
        Cancel
      </button>
    </form>
  );
};

export default RouletteForm;
