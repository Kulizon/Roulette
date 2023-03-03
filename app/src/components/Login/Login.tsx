import { useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { socket } from "../../index";
import { useDispatch } from "react-redux";
import { changeUser } from "../../store/user";

import styles from "./Login.module.scss";

const Login = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    socket.on(
      "loginSuccess",
      (user: { name: string; image: string; jwt: string }) => {
        alert("Login successful");
        console.log(user);

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
      <h1>Login</h1>
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
