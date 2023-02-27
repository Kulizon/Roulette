import RouletteSpinner from "./RouletteSpinner/RouletteSpinner";
import RouletteHistory from "./RouletteHistory/RouletteHistory";
import RouletteForm from "./RouletteForm/RouletteForm";
import RouletteCurrentBets from "./RouletteCurrentBets/RouletteCurrentBets";

const Roulette = () => {
  return (
    <div>
      <RouletteSpinner></RouletteSpinner>
      <RouletteHistory></RouletteHistory>
      <RouletteCurrentBets></RouletteCurrentBets>
      <RouletteForm></RouletteForm>
    </div>
  );
};

export default Roulette;
