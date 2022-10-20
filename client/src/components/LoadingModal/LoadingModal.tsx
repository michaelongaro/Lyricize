import { useState, useEffect, useContext } from "react";

import SpotifyContext from "../../context/SpotifyContext";

import classes from "./LoadingModal.module.css";
import "../../index.css";

type Props = {};

function LoadingModal({}: Props) {
  const spotifyCtx = useContext(SpotifyContext);

  const [totalEstimatedTime, setTotalEstimatedTime] = useState<number>(0);
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] =
    useState<string>("");

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    if (spotifyCtx) {
      if (spotifyCtx.refreshLyrics && spotifyCtx.totalLikedSongs) {
        // it takes roughly .6 seconds to fetch lyrics for each song
        setTotalEstimatedTime(spotifyCtx.totalLikedSongs * 0.6);
      }
    }
  }, [spotifyCtx?.refreshLyrics, spotifyCtx?.totalLikedSongs]);

  useEffect(() => {
    let interval: number;
    if (totalEstimatedTime) {
      interval = setInterval(() => {
        setEstimatedTimeRemaining(getTimeRemaining());
        setTotalEstimatedTime((prevTime) => prevTime - 1);
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [totalEstimatedTime]);

  const getTimeRemaining = (): string => {
    if (totalEstimatedTime) {
      const minutes = Math.floor(
        ((totalEstimatedTime - (totalEstimatedTime % 60)) / 60) % 60
      );
      const seconds = Math.floor(totalEstimatedTime % 60);

      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

      return `${formattedMinutes}:${formattedSeconds}`;
    }

    return "00:00";
  };

  return (
    <div className={`${classes.modalBackground} baseFlex`}>
      <div className={`${classes.modalContainer} baseVertFlex`}>
        <div>Fetching lyrics...</div>
        <div className={classes.parentLoader}>
          <div className={classes.loader}>
            <svg className={classes.circle} viewBox="25 25 50 50">
              <circle
                className={classes.loaderPath}
                cx="50"
                cy="50"
                r="20"
                fill="none"
                stroke="#70c542"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>
        {estimatedTimeRemaining && (
          <div style={{ gap: ".5rem" }} className={"baseVertFlex"}>
            <div>estimated time remaining:</div>
            <div>{estimatedTimeRemaining}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoadingModal;
