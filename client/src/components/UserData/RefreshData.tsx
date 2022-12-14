import { useState, useContext } from "react";
import SpotifyContext from "../../context/SpotifyContext";

import refreshIcon from "../../assets/refresh.svg";

import classes from "./RefreshData.module.css";
import "../../index.css";

type Props = {};

function RefreshData({}: Props) {
  const spotifyCtx = useContext(SpotifyContext);

  const [rotateDegrees, setRotateDegrees] = useState("0deg");

  return (
    <button
      className={`${classes.refreshButton} baseFlex`}
      onMouseDown={() => setRotateDegrees("270deg")}
      onTouchStart={() => setRotateDegrees("270deg")}
      onMouseUp={() => {
        setRotateDegrees("0deg");
        spotifyCtx?.setRefreshLyrics(true);
      }}
      onTouchEnd={() => {
        setRotateDegrees("0deg");
        spotifyCtx?.setRefreshLyrics(true);
      }}
      onMouseOut={() => setRotateDegrees("0deg")}
      onTouchCancel={() => setRotateDegrees("0deg")}
    >
      <img
        style={{ rotate: `${rotateDegrees}` }}
        src={refreshIcon}
        alt={"Refresh lyrics"}
      />
    </button>
  );
}

export default RefreshData;
