import React from "react";

import logoutIcon from "../../assets/logout.svg";

import classes from "./Logout.module.css";

type Props = {};

function Logout({}: Props) {
  return (
    <button
      className={classes.logOutButton}
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
        <img src={logoutIcon} />
        <div>Log Out</div>
      </div>
    </button>
  );
}

export default Logout;
