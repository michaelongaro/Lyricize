import React from "react";

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
      Log Out
    </button>
  );
}

export default Logout;
