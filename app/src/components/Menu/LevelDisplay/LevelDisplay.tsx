import styles from "./LevelDisplay.module.scss";

const LevelDisplay = (props: { level: number }) => {
  return (
    <div className={styles.display}>
      <svg viewBox="0 0 36 36">
        <path
          d="M18 2.0845
      a 15.9155 15.9155 0 0 1 0 31.831
      a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="#34365d"
          stroke="#eba232"
          strokeWidth="3"
          strokeDasharray={`${Math.floor(
            (props.level - Math.floor(props.level)) * 100
          )}, 100`}
        />
      </svg>
      <span>Level {Math.floor(props.level)}</span>
    </div>
  );
};

export default LevelDisplay;
