import { useContext } from "react";

// @ts-ignore
import BubbleChart from "@weknow/react-bubble-chart-d3";
import useScreenSize from "use-screen-size";

import SpotifyContext from "../../context/SpotifyContext";

import classes from "./LyricMap.module.css";
import "../../index.css";
import UserData from "../UserData/UserData";

type Props = {};

function LyricMap({}: Props) {
  const size = useScreenSize();

  const spotifyCtx = useContext(SpotifyContext);

  const transformData = (userLyrics: [string, number][]) => {
    const transformedData = [];
    for (const lyric of userLyrics.slice(0, 10)) {
      // take out splice
      transformedData.push({
        label: lyric[0],
        value: lyric[1],
      });
    }
    console.log(transformedData);

    return transformedData;
  };

  return (
    <div className={"baseVertFlex"}>
      {typeof spotifyCtx?.userLyrics === "object" && spotifyCtx.userLyrics ? (
        <BubbleChart
          graph={{
            zoom: 1,
          }}
          width={size.width}
          height={1100}
          padding={1} // optional value, number that set the padding between bubbles
          showLegend={false}
          data={transformData(spotifyCtx.userLyrics)}
          selectedColor="#737373"
          selectedTextColor="#d9d9d9"
        />
      ) : (
        <div>No results found</div>
      )}
    </div>
  );
}

export default LyricMap;
