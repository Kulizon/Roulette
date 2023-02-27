import Menu from "./components/Menu/Menu";
import Games from "./components/Games/Games";

import styles from "./App.module.scss";

const App = () => {
  return (
    <div className={styles.app}>
      <Menu></Menu>
      <Games></Games>
    </div>
  );
};

export default App;
