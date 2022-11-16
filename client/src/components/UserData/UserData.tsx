import { useContext } from "react";

import SpotifyContext from "../../context/SpotifyContext";

import CopyToClipboard from "../ui/CopyToClipboard";

import defaultUserImage from "../../assets/user.svg";

import classes from "./UserData.module.css";
import "../../index.css";

type Props = {};

function UserData({}: Props) {
  const spotifyCtx = useContext(SpotifyContext);

  if (!spotifyCtx?.currentUsername) {
    return <>/</>;
  }

  return (
    <div className={`${classes.dataContainer} baseFlex`}>
      <div className={`${classes.pfpContainer} baseFlex`}>
        <img
          style={{ borderRadius: spotifyCtx.currentPFP ? "50%" : 0 }}
          className={spotifyCtx.currentPFP ? "" : classes.fallbackPFP}
          src={spotifyCtx.currentPFP ?? defaultUserImage}
          alt={
            spotifyCtx.currentPFP
              ? "Spotify user profile"
              : "Default user profile"
          }
        />
      </div>

      {spotifyCtx.currentUsername && (
        <div className={classes.username}>{spotifyCtx.currentUsername}</div>
      )}

      <CopyToClipboard />
    </div>
  );
}

export default UserData;
