import React from "react";
import ReactDOM from "react-dom/client";
import { io } from "socket.io-client";
import { Provider } from "react-redux";
import store from "./store/index";

import "./index.scss";

import App from "./App";

export const socket = io("ws://localhost:8080");

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
