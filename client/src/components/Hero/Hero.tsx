import React from "react";

import Login from "../Authentication/Login";

import classes from "./Hero.module.css";
import "../../index.css";

type Props = {};

function Hero({}: Props) {
  return (
    <div className={`${classes.hero} baseVertFlex`}>
      <div className={classes.logo}>Lyricize</div>
      <div className={classes.subtitle}>
        visualize the most popular lyrics from your{" "}
        <span className={classes.spotifyText}>Spotify</span>
      </div>

      <Login />

      <div className={classes.disclaimer}>
        <div className={"baseFlex"}>
          Your Spotify email must be manually whitelisted to use this app.*
        </div>
      </div>
    </div>
  );
}

export default Hero;
