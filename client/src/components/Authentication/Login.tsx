import { useState } from "react";

import spotifyIcon from "../../assets/spotify.png";

import classes from "./Login.module.css";
import "../../index.css";

type Props = {};

let redirectUri = import.meta.env.VITE_CURRENT_URL;

if (redirectUri !== "http://localhost:5000") {
  redirectUri += "/";
}

const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=013a8341148c440caa3fe56fa4742c7c&response_type=code&redirect_uri=${redirectUri}&scope=user-library-read%20user-read-email%20user-read-private`;

function Login({}: Props) {
  const [animationStarted, setAnimationStarted] = useState(false);

  return (
    <button
      style={{
        gap: ".75rem",
        zIndex: animationStarted ? 1000 : 1,
        transform: `scale(${animationStarted ? 200 : 1}`,
        pointerEvents: animationStarted ? "none" : "auto",
        transition: animationStarted ? "all 2000ms" : "all 150ms",
      }}
      className={`${classes.loginButton} baseFlex`}
      onClick={() => {
        setTimeout(() => (window.location.href = AUTH_URL), 350);
        setAnimationStarted(true);
      }}
    >
      <div
        style={{
          color: animationStarted ? "#1DB954" : "white",
        }}
      >
        Login
      </div>
      <img
        style={{ opacity: animationStarted ? 0 : 1 }}
        src={spotifyIcon}
        alt={"Spotify Logo"}
      ></img>
    </button>
  );
}

export default Login;
