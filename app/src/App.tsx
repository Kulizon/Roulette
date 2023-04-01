import { useSelector } from "react-redux";
import { RootState } from "./store";
import { socket } from "./index";

import Menu from "./components/Menu/Menu";
import Games from "./components/Games/Games";
import Login from "./components/Login/Login";
import { ToastContainer, toast } from "react-toastify";

import styles from "./App.module.scss";
import { useEffect } from "react";

const App = () => {
  const { jwt } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    socket.on("connect_error", (err) => {
      toast.error("Server error occured...");
      socket.removeListener("connect_error");
    });

    return () => {
      socket.removeListener("connect_error");
    };
  }, [socket]);

  return (
    <div className={styles.app}>
      <ToastContainer
        position="bottom-right"
        theme="dark"
        toastStyle={{ backgroundColor: "#11121c" }}
      />
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
