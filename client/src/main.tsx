import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { SpotifyProvider } from "./context/SpotifyContext";
import "./index.scss";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <SpotifyProvider>
    <App />
  </SpotifyProvider>
);
