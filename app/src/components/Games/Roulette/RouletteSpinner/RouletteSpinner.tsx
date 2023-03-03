import { useEffect, useRef, useState } from "react";
import { RouletteSpan } from "../../../../types/RouletteSpan";

import { socket } from "./../../../../index";

import styles from "./RouletteSpinner.module.scss";

import chip1 from "./../../../../resources/chip1.png";
import chip2 from "./../../../../resources/chip2.png";
import chip3 from "./../../../../resources/chip3.png";

const CHIP_WIDTH = 100;
const ROULETTE_WIDTH = 800;

const RouletteSpinner = () => {
  const [spin, setSpin] = useState(0);
  const [spans, setSpans] = useState<RouletteSpan[]>([]);
  const [winner, setWinner] = useState<number | null>();
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.emit("getSpans");

    socket.on(
      "spans",
      (data: {
        spans: RouletteSpan[];
        winner: number;
        isInitial?: boolean;
      }) => {
        if (!innerRef.current) return;
        innerRef.current!.style.transition = "0s";

        setWinner(null);
        setSpin(0);
        setSpans(data.spans);

        const timeoutLength = data.isInitial ? 50 : 1000;

        setTimeout(() => {
          const randomOffSet = Math.floor(Math.random() * 60 - 30);
          const newSpin =
            -data.winner * CHIP_WIDTH +
            ROULETTE_WIDTH / 2 -
            CHIP_WIDTH / 2 +
            randomOffSet;

          if (!data.isInitial && innerRef.current)
            innerRef.current!.style.transition = "1.5s";

          setSpin(newSpin);

          setTimeout(
            () => {
              setWinner(data.winner);
            },
            data.isInitial ? 10 : 1500 // animation length
          );
        }, timeoutLength);
      }
    );

    return () => {
      socket.removeListener("spans");
    };
  }, []);

  return (
    <div className={styles.outer}>
      <div className={styles["gradient-left"]}></div>
      <span className={styles.arrow}></span>
      <div
        className={styles.inner}
        ref={innerRef}
        style={{ transform: `translateX(${spin}px)` }}
      >
        {spans.map((s) => (
          <span key={Math.random()}>
            <div>
              <img
                src={
                  s.number % 2 === 0 ? chip1 : s.number === -1 ? chip2 : chip3
                }
              ></img>
              <h4>{s.number}</h4>
            </div>
          </span>
        ))}
      </div>
      <h3>Winner is {winner ? spans[winner]?.number : "..."}</h3>
      <div className={styles["gradient-right"]}></div>
    </div>
  );
};

export default RouletteSpinner;
