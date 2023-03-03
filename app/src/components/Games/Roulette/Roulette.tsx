import RouletteSpinner from "./RouletteSpinner/RouletteSpinner";
import RouletteHistory from "./RouletteHistory/RouletteHistory";
import BetForm from "./../../UI/BetForm/BetForm";
import RouletteCurrentBets from "./RouletteCurrentBets/RouletteCurrentBets";

import styles from "./Roulette.module.scss";

const Roulette = () => {
  return (
    <div className={styles.roulette}>
      <RouletteHistory></RouletteHistory>
      <RouletteSpinner></RouletteSpinner>
      <BetForm type="roulette"></BetForm>
      <RouletteCurrentBets></RouletteCurrentBets>
    </div>
  );
};

export default Roulette;
