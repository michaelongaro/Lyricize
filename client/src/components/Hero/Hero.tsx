import React from "react";

import Login from "../Authentication/Login";

import classes from "./Hero.module.css";
import "../../index.css";

type Props = {};

function Hero({}: Props) {
  return (
    <div className={`${classes.hero} baseVertFlex`}>
      <div style={{ fontSize: "3em" }}>Lyricize</div>
      <div style={{ textAlign: "center" }}>
        visualize the most popular lyrics from your{" "}
        <span className={classes.spotifyText}>Spotify</span>
      </div>

      <Login />
    </div>
  );
}

export default Hero;
