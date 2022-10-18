import React from "react";

import classes from "./PersonalGlobalToggle.module.css";
import "../../index.css";

type Props = {};

function PersonalGlobalToggle({}: Props) {
  return (
    <div className={`${classes.toggleContain} baseFlex`}>
      <button>My Stats</button>
      <button>Global Stats</button>
    </div>
  );
}

export default PersonalGlobalToggle;
