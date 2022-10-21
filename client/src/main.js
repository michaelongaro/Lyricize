import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { SpotifyProvider } from "./context/SpotifyContext";
import "./index.css";
ReactDOM.createRoot(document.getElementById("root")).render(<SpotifyProvider>
    <App />
  </SpotifyProvider>);
