import { useContext } from "react";

import SpotifyContext from "../../context/SpotifyContext";

import RefreshData from "../UserData/RefreshData";

import userIcon from "../../assets/user.svg";
import worldIcon from "../../assets/world.svg";

import classes from "./PersonalGlobalToggle.module.scss";
import "../../index.scss";
import Logout from "../Authentication/Logout";

type Props = {};

function PersonalGlobalToggle({}: Props) {
  const spotifyCtx = useContext(SpotifyContext);

  return (
    <div className={`${classes.topContainer} buttonContainer`}>
      <div className={classes.mobileLogoLogoutContainer}>
        <div className={classes.logo}>Lyricize</div>
        <Logout />
      </div>
      <div className={classes.desktopLogo}>
        <div className={classes.logo}>Lyricize</div>
      </div>
      <div className={`${classes.controlsContainer} baseFlex`}>
        <button
          onClick={() => spotifyCtx?.setShowUserLyrics(true)}
          className={`${classes.toggleButton} ${
            spotifyCtx?.showUserLyrics ? "toggledOn" : ""
          } baseFlex`}
        >
          <img src={userIcon} className={classes.icon} alt={"User"} />
          My Stats
        </button>
        <button
          onClick={() => spotifyCtx?.setShowUserLyrics(false)}
          className={`${classes.toggleButton} ${
            !spotifyCtx?.showUserLyrics ? "toggledOn" : ""
          } baseFlex`}
        >
          <img src={worldIcon} className={classes.icon} alt={"Global"} />
          Global Stats
        </button>

        <RefreshData />
      </div>
      <div className={classes.desktopLogout}>
        <Logout />
      </div>
    </div>
  );
}

export default PersonalGlobalToggle;
