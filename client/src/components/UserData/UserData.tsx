import { useContext, useEffect, useState } from "react";

import SpotifyContext from "../../context/SpotifyContext";

import defaultUserImage from "../../assets/user.svg";

import classes from "./UserData.module.css";
import "../../index.css";

type Props = {};

function UserData({}: Props) {
  const spotifyCtx = useContext(SpotifyContext);

  const [userHasPFP, setUserHasPFP] = useState<boolean>(false);

  useEffect(() => {
    if (spotifyCtx && spotifyCtx.currentPFP && spotifyCtx.currentUsername) {
      if (spotifyCtx.currentPFP === "User has no PFP") {
        setUserHasPFP(false);
      } else {
        setUserHasPFP(true);
      }
    }
  }, [spotifyCtx?.currentPFP, spotifyCtx?.currentUsername]);

  if (!spotifyCtx?.currentPFP && !spotifyCtx?.currentUsername) {
    return <>/</>;
  }

  return (
    <div className={`${classes.dataContainer} baseFlex`}>
      {userHasPFP
        ? spotifyCtx.currentPFP && (
            <div className={`${classes.pfpContainer} baseFlex`}>
              <img src={spotifyCtx.currentPFP} />
            </div>
          )
        : spotifyCtx.currentUsername && (
            <div className={`${classes.pfpContainer} baseFlex`}>
              <img style={{ width: "50%" }} src={defaultUserImage} />
            </div>
          )}

      {spotifyCtx.currentUsername && (
        <div className={classes.username}>{spotifyCtx.currentUsername}</div>
      )}
    </div>
  );
}

export default UserData;
