import { useSelector } from "react-redux";
import { RootState } from "./store";

import Menu from "./components/Menu/Menu";
import Games from "./components/Games/Games";
import Login from "./components/Login/Login";

import styles from "./App.module.scss";

const App = () => {
  const { jwt } = useSelector((state: RootState) => state.user);

  return (
    <div className={styles.app}>
      {!jwt && <Login></Login>}
      {jwt && (
        <>
          <Menu></Menu>
          <Games></Games>
        </>
      )}
    </div>
  );
};

export default App;
