import React from "react";
import ReactDOM from "react-dom/client";
import { io } from "socket.io-client";
import { Provider } from "react-redux";
import store from "./store/index";
import { GoogleOAuthProvider } from "@react-oauth/google";

import "./index.scss";

import App from "./App";

export const socket = io("ws://localhost:8080");


const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID!}>
      <Provider store={store}>
        <App />
      </Provider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
