import React from "react";

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
  return (
    <a
      style={{ gap: ".75rem" }}
      className={`${classes.loginButton} baseFlex`}
      href={AUTH_URL}
    >
      <div>Login</div>
      <img src={spotifyIcon} alt={"Spotify Logo"}></img>
    </a>
  );
}

export default Login;
