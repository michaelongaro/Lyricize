import { useContext, useState, useEffect } from "react";

// @ts-ignore
import BubbleChart from "@weknow/react-bubble-chart-d3";

import LyricLengthFilter from "../LyricLengthFilter/LyricLengthFilter";

import SpotifyContext from "../../context/SpotifyContext";

import LoadingModal from "../LoadingModal/LoadingModal";

import classes from "./LyricMap.module.css";
import "../../index.css";

type Props = {};

function LyricMap({}: Props) {
  const spotifyCtx = useContext(SpotifyContext);

  const [userLyricsSortedByLength, setUserLyricsSortedByLength] = useState<
    [string, number][] | null
  >(null);

  const [numberOfLyricsToShow, setNumberOfLyricsToShow] = useState<number>(50);

  const [currentScreenWidth, setCurrentScreenWidth] = useState<number>(0);

  useEffect(() => {
    if (userLyricsSortedByLength) {
      setNumberOfLyricsToShow(50);
    }
  }, [userLyricsSortedByLength]);

  useEffect(() => {
    const handleResize = () => {
      setCurrentScreenWidth(window.innerWidth);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const transformData = (userLyrics: [string, number][]) => {
    const transformedData = [];
    for (const lyric of userLyrics.slice(0, numberOfLyricsToShow)) {
      // replace slice with real logic (maybe just a context state that stores how many to show)
      transformedData.push({
        label: lyric[0],
        value: lyric[1],
      });
    }
    console.log(transformedData);

    return transformedData;
  };

  return (
    <div style={{ gap: "2rem" }} className={"baseVertFlex"}>
      {spotifyCtx?.currentlySelectedLyrics && (
        <div style={{ gap: "1.5rem" }} className={"baseVertFlex"}>
          <LyricLengthFilter
            originalUserLyrics={spotifyCtx.currentlySelectedLyrics}
            setFilteredUserLyrics={setUserLyricsSortedByLength}
          />

          <div style={{ gap: "1rem" }} className={"baseFlex"}>
            <button
              disabled={numberOfLyricsToShow <= 50}
              onClick={() => {
                setNumberOfLyricsToShow((prevNum) => prevNum - 50);
              }}
              className={"changeShownLyricAmount"}
            >
              Show 50 less
            </button>
            <button
              disabled={
                userLyricsSortedByLength &&
                numberOfLyricsToShow >= userLyricsSortedByLength.length
                  ? true
                  : false
              }
              onClick={() => {
                setNumberOfLyricsToShow((prevNum) => prevNum + 50);
              }}
              className={"changeShownLyricAmount"}
            >
              Show 50 more
            </button>
          </div>
        </div>
      )}

      {userLyricsSortedByLength && !spotifyCtx?.refreshLyrics ? (
        <BubbleChart
          graph={{
            zoom: 1,
          }}
          width={currentScreenWidth * 0.95}
          height={currentScreenWidth * 0.95}
          padding={5} // optional value, number that set the padding between bubbles
          showLegend={false}
          data={transformData(userLyricsSortedByLength)}
          selectedColor="#737373"
          selectedTextColor="#d9d9d9"
        />
      ) : (
        <LoadingModal />
      )}
    </div>
  );
}

export default LyricMap;
