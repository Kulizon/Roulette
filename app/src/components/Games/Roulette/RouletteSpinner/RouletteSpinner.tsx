import { useEffect, useRef, useState } from "react";
import { RouletteSpan } from "../../../../types/RouletteSpan";

import { socket } from "./../../../../index";

import styles from "./RouletteSpinner.module.scss";

const RouletteSpinner = () => {
  const [spin, setSpin] = useState(0);
  const [spans, setSpans] = useState<RouletteSpan[]>([]);
  const [winner, setWinner] = useState<number | null>();
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.on(
      "spans",
      (data: {
        spans: RouletteSpan[];
        winner: number;
        isInitial?: boolean;
      }) => {
        if (!innerRef.current) return;
        innerRef.current!.style.transition = "0s";
        setSpin(0);
        setWinner(null);

        const timeoutLength = data.isInitial ? 50 : 1000;

        setTimeout(() => {
          const randomOffSet = Math.floor(Math.random() * 100 - 50);
          const newSpin = -data.winner * 150 + 75 + 150 + randomOffSet;

          innerRef.current!.style.transition = "1.5s";
          setSpin(newSpin);

          setSpans(data.spans);

          setTimeout(() => {
            setWinner(data.winner);
          }, 1500); // animation length
        }, timeoutLength);
      }
    );
  }, []);

  return (
    <div className={styles.outer}>
      <span className={styles.arrow}></span>
      <div
        className={styles.inner}
        ref={innerRef}
        style={{ transform: `translateX(${spin}px)` }}
      >
        {spans.map((s) => (
          <span key={s.number}>
            <div>{s.number}</div>
          </span>
        ))}
      </div>
      <h5>{-1}</h5>
      <h3>Winner is {winner ? spans[winner]?.number : ""}</h3>
    </div>
  );
};

export default RouletteSpinner;
