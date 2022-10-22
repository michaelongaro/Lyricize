import React from "react";

import classes from "./AnimatedStarBackground.module.css";

type Props = {};

function AnimatedStarBackground({}: Props) {
  return (
    <div className={classes.bgAnimation}>
      <div className={classes.stars}></div>
      <div className={classes.stars2}></div>
      <div className={classes.stars3}></div>
      <div className={classes.stars4}></div>
    </div>
  );
}

export default AnimatedStarBackground;
