import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import Navigation from "./components/shared/Navigation.jsx";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { SocketProvider } from "./SocketProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <Navigation />
      <SocketProvider>
        <App />
      </SocketProvider>
    </Provider>
  </React.StrictMode>
);
