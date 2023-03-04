import { useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { socket } from "../../index";
import { useDispatch } from "react-redux";
import { changeUser } from "../../store/user";

import styles from "./Login.module.scss";
import chip1 from "./../../resources/chip1.png";
import chip2 from "./../../resources/chip2.png";
import chip3 from "./../../resources/chip3.png";

const Login = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    socket.on(
      "loginSuccess",
      (user: { name: string; image: string; jwt: string }) => {
        dispatch(changeUser(user));
      }
    );
    socket.on("loginFailure", () => {
      alert("Login failed");
    });

    return () => {
      socket.off("loginSuccess");
      socket.off("loginFailure");
    };
  }, []);

  return (
    <div className={styles.login}>
      <h1>Login!</h1>
      <div className={styles.chips}>
        <img src={chip1} alt="Chip 1" />
        <img src={chip2} alt="Chip 2" />
        <img src={chip3} alt="Chip 3" />
      </div>
      <GoogleLogin
        onSuccess={(response) => socket.emit("login", response.credential)}
        onError={() => {
          console.log("Login Failed");
        }}
      />
    </div>
  );
};

export default Login;
