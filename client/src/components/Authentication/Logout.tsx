import { useState } from "react";

import logoutIcon from "../../assets/logout.svg";

import classes from "./Logout.module.css";

type Props = {};

function Logout({}: Props) {
  const [brightness, setBrightness] = useState("brightness(1)");

  return (
    <button
      style={{ filter: brightness }}
      className={classes.logOutButton}
      onMouseDown={() => setBrightness("brightness(0.5)")}
      onMouseUp={() => setBrightness("brightness(1)")}
      onMouseEnter={() => setBrightness("brightness(0.7)")}
      onMouseLeave={() => setBrightness("brightness(1)")}
      onTouchStart={() => setBrightness("brightness(0.5)")}
      onTouchEnd={() => setBrightness("brightness(1)")}
      onClick={() => {
        const url = "https://accounts.spotify.com/en/logout";
        const spotifyLogoutWindow = window.open(
          url,
          "Spotify Logout",
          "width=700,height=500,top=40,left=40"
        );
        setTimeout(() => {
          spotifyLogoutWindow?.close();
          location.reload();
        }, 2000);
      }}
    >
      <div className={`${classes.innerLogout} baseFlex`}>
        <img src={logoutIcon} alt={"Logout"} />
        <div>Log Out</div>
      </div>
    </button>
  );
}

export default Logout;
