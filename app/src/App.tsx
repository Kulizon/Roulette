import Menu from "./components/Menu/Menu";
import Games from "./components/Games/Games";
import Login from "./components/Login/Login";

import styles from "./App.module.scss";

const App = () => {
  return (
    <div className={styles.app}>
      <Login></Login>
      <Menu></Menu>
      <Games></Games>
    </div>
  );
};

export default App;
