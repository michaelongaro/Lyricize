import { useState, useEffect, useContext } from "react";

import SpotifyContext from "../../context/SpotifyContext";
import ProgressBar from "./ProgressBar";

import classes from "./LoadingModal.module.css";
import "../../index.css";

type Props = {};

function LoadingModal({}: Props) {
  const spotifyCtx = useContext(SpotifyContext);

  const [totalEstimatedTime, setTotalEstimatedTime] = useState<number>(0);
  const [constTotalEstimatedTime, setConstTotalEstimatedTime] =
    useState<number>(0);
  const [totalProgressBarEstimatedTime, setTotalProgressBarEstimatedTime] =
    useState<number>(0);
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
        // it takes roughly .45 seconds to fetch lyrics for each song
        setTotalEstimatedTime(spotifyCtx.totalLikedSongs * 0.45);
        setConstTotalEstimatedTime(spotifyCtx.totalLikedSongs * 0.45);
        setTotalProgressBarEstimatedTime(spotifyCtx.totalLikedSongs * 0.45);
      }
    }
  }, [spotifyCtx?.refreshLyrics, spotifyCtx?.totalLikedSongs]);

  useEffect(() => {
    let formattedInterval: number;

    if (totalEstimatedTime) {
      formattedInterval = window.setInterval(() => {
        setEstimatedTimeRemaining(getTimeRemaining(totalEstimatedTime));

        setTotalEstimatedTime((prevTime) => prevTime - 1);
      }, 1000);
    }

    return () => {
      clearInterval(formattedInterval);
    };
  }, [totalEstimatedTime]);

  useEffect(() => {
    let secondsInterval: number;

    if (totalProgressBarEstimatedTime) {
      secondsInterval = window.setInterval(() => {
        setTotalProgressBarEstimatedTime((prevTime) => prevTime - 1);
      }, 1000);
    }

    return () => {
      clearInterval(secondsInterval);
    };
  }, [totalProgressBarEstimatedTime]);

  const getTimeRemaining = (remainingTime: number): string => {
    if (remainingTime > 0) {
      const minutes = Math.floor(
        ((remainingTime - (remainingTime % 60)) / 60) % 60
      );
      const seconds = Math.floor(remainingTime % 60);

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
        {spotifyCtx?.userSongList && estimatedTimeRemaining !== "00:00" ? (
          <ProgressBar
            estimatedSecondsRemainingStr={Math.floor(
              totalProgressBarEstimatedTime
            ).toString()}
            progressBarTimeElapsed={totalEstimatedTime}
            totalTime={Math.floor(constTotalEstimatedTime)}
          />
        ) : (
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
                  strokeWidth="3"
                />
              </svg>
            </div>
          </div>
        )}
        {estimatedTimeRemaining && estimatedTimeRemaining !== "00:00" ? (
          <div style={{ gap: ".5rem" }} className={"baseVertFlex"}>
            <div>estimated time remaining:</div>
            <div style={{ fontSize: "1.5em" }}>{estimatedTimeRemaining}</div>
          </div>
        ) : (
          spotifyCtx?.userSongList &&
          estimatedTimeRemaining === "00:00" && <div>finishing up!</div>
        )}
      </div>
    </div>
  );
}

export default LoadingModal;
