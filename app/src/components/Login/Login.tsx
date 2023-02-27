import { useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { socket } from "../../index";
import { useDispatch } from "react-redux";
import { changeToken } from "../../store/user";

const Login = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    socket.on("loginSuccess", (jwt: string) => {
      alert("Login successful");
      dispatch(changeToken(jwt));
    });
    socket.on("loginFailure", () => {
      alert("Login failed");
      dispatch(changeToken(""));
    });

    return () => {
      socket.off("loginSuccess");
      socket.off("loginFailure");
    };
  }, []);

  return (
    <div>
      <h1>Login</h1>
      <GoogleLogin
        onSuccess={(response) => socket.emit("login", response.credential)}
        onError={() => {
          console.log("Login Failed");
        }}
      />
      ;
    </div>
  );
};

export default Login;
