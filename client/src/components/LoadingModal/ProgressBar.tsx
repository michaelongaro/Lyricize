import { useContext, useEffect, useState } from "react";
import SpotifyContext from "../../context/SpotifyContext";

import { Line } from "rc-progress";

import "../../index.css";

type Props = {
  estimatedSecondsRemainingStr: string;
  progressBarTimeElapsed: number;
  totalTime: number;
};

function ProgressBar({
  estimatedSecondsRemainingStr,
  progressBarTimeElapsed,
  totalTime,
}: Props) {
  const spotifyCtx = useContext(SpotifyContext);

  const estimatedProgressBarTimeElapsed =
    totalTime - parseInt(estimatedSecondsRemainingStr);

  // const estimatedTimeElapsed = totalTime - progressBarTimeElapsed;
  const [progressPercentage, setProgressPercentage] = useState<number>(0);
  useEffect(() => {
    if (
      spotifyCtx &&
      spotifyCtx.incrementalIndex &&
      spotifyCtx.totalLikedSongs
    ) {
      // look at these numbers and see why it isn't
      setProgressPercentage(
        (spotifyCtx.incrementalIndex / spotifyCtx.totalLikedSongs) * 100
      );
    }
  }, [spotifyCtx?.incrementalIndex, spotifyCtx?.totalLikedSongs]);

  let currentSong: string = "";

  if (spotifyCtx?.userSongList) {
    const songIdx = Math.floor(
      (estimatedProgressBarTimeElapsed / totalTime) *
        spotifyCtx.userSongList.length
    );
    currentSong = spotifyCtx.userSongList[songIdx];
    if (currentSong) {
      currentSong = currentSong.replace(",", " - ");
    } else {
      currentSong = "";
    }
  }

  return (
    <div style={{ gap: "1rem" }} className={"baseVertFlex"}>
      <div style={{ width: "15rem" }}>
        <Line
          percent={progressPercentage}
          strokeWidth={10}
          strokeColor="#1DB954"
          trailWidth={10}
        />
      </div>
      <div
        style={{
          gap: ".5rem",
          width: "25rem",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textAlign: "left",
          textOverflow: "ellipsis",
        }}
        className={"baseVertFlex"}
      >
        <div>{currentSong}</div>
      </div>
    </div>
  );
}

export default ProgressBar;
