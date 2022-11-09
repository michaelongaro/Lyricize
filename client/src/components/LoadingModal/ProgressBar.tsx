import { useContext } from "react";
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
  const progressPercentage = Math.floor(
    spotifyCtx.incrementalIndex / spotifyCtx.totalLikedSongs
  );

  const percentOfSongsFetched = Math.floor(
    (estimatedTimeElapsed / totalTime) * 100
  );

  let currentSong: string = "";

  if (spotifyCtx?.userSongList) {
    const songIdx = Math.floor(
      (estimatedProgressBarTimeElapsed / totalTime) *
        spotifyCtx.userSongList.length
    );
    currentSong = spotifyCtx.userSongList[songIdx];
    currentSong = currentSong.replace(",", " - ");
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
