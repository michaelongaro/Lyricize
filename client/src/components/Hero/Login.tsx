import React from "react";

import spotifyIcon from "../../assets/spotify.svg";

import classes from "./Login.module.css";
import "../../index.css";

type Props = {};

const AUTH_URL =
  "https://accounts.spotify.com/authorize?client_id=013a8341148c440caa3fe56fa4742c7c&response_type=code&redirect_uri=https://fierce-mesa-30544.herokuapp.com/&scope=user-library-read%20user-read-email%20user-read-private";

function Login({}: Props) {
  return (
    <a
      style={{ gap: "1rem" }}
      className={`${classes.loginButton} baseFlex`}
      href={AUTH_URL}
    >
      <div>Login</div>
      <img src={spotifyIcon}></img>
    </a>
  );
}

export default Login;
