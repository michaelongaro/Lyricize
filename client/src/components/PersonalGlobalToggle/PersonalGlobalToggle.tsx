import { useContext } from "react";

import SpotifyContext from "../../context/SpotifyContext";

import RefreshData from "../UserData/RefreshData";

import userIcon from "../../assets/user.svg";
import worldIcon from "../../assets/world.svg";

import classes from "./PersonalGlobalToggle.module.css";
import "../../index.css";

type Props = {};

function PersonalGlobalToggle({}: Props) {
  const spotifyCtx = useContext(SpotifyContext);

  return (
    <div
      style={{ marginTop: "1rem", gap: "1.5rem" }}
      className={"buttonContainer baseVertFlex"}
    >
      <div className={classes.logo}>Lyricize</div>
      <div className={"baseFlex"}>
        <button
          onClick={() => spotifyCtx?.setShowUserLyrics(true)}
          className={`${classes.toggleButton} ${
            spotifyCtx?.showUserLyrics ? "toggledOn" : ""
          } baseFlex`}
        >
          <img src={userIcon} className={classes.icon} />
          My Stats
        </button>
        <button
          onClick={() => spotifyCtx?.setShowUserLyrics(false)}
          className={`${classes.toggleButton} ${
            !spotifyCtx?.showUserLyrics ? "toggledOn" : ""
          } baseFlex`}
        >
          <img src={worldIcon} className={classes.icon} />
          Global Stats
        </button>

        <RefreshData />
      </div>
    </div>
  );
}

export default PersonalGlobalToggle;
