import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import store from "apis/store";
import { LanguageProvider } from "./language";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <LanguageProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </LanguageProvider>
);
