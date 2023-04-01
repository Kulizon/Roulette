import { useEffect } from "react";
import { GoogleCredentialResponse, GoogleLogin } from "@react-oauth/google";
import { socket } from "../../index";
import { useDispatch } from "react-redux";
import { changeUser } from "../../store/user";
import { toast } from "react-toastify";

import styles from "./Login.module.scss";
import chip1 from "./../../resources/chip1.png";
import chip2 from "./../../resources/chip2.png";
import chip3 from "./../../resources/chip3.png";

const Login = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!socket) return;
    socket.on(
      "loginSuccess",
      (user: { name: string; image: string; jwt: string }) => {
        dispatch(changeUser(user));
      }
    );
    socket.on("loginFailure", () => {
      toast("Login failed");
    });

    return () => {
      if (!socket) return;
      socket.off("loginSuccess");
      socket.off("loginFailure");
    };
  }, []);

  const loginHandler = (response: GoogleCredentialResponse) => {
    if (!socket) return;

    if (!socket.connected) toast.error("Server error occured...");

    socket.emit("login", response.credential);
  };
  const errorHandler = () => {
    toast("Server error occured... login failed...");
  };

  return (
    <div className={styles.login}>
      <h1>Login!</h1>
      <div className={styles.chips}>
        <img src={chip1} alt="Chip 1" />
        <img src={chip2} alt="Chip 2" />
        <img src={chip3} alt="Chip 3" />
      </div>
      <GoogleLogin onSuccess={loginHandler} onError={errorHandler} />
    </div>
  );
};

export default Login;
