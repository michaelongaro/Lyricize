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

  const [decreaseButtonBrightness, setDecreaseButtonBrightness] =
    useState("brightness(1)");
  const [increaseButtonBrightness, setIncreaseButtonBrightness] =
    useState("brightness(1)");
  const [numberOfLyricsToShow, setNumberOfLyricsToShow] = useState<number>(100);

  const [currentScreenWidth, setCurrentScreenWidth] = useState<number>(0);

  useEffect(() => {
    if (userLyricsSortedByLength) {
      setNumberOfLyricsToShow(100);
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
              style={{ filter: decreaseButtonBrightness }}
              disabled={numberOfLyricsToShow <= 100}
              onMouseDown={() => setDecreaseButtonBrightness("brightness(0.5)")}
              onMouseUp={() => setDecreaseButtonBrightness("brightness(1)")}
              onMouseEnter={() =>
                setDecreaseButtonBrightness("brightness(0.7)")
              }
              onMouseLeave={() => setDecreaseButtonBrightness("brightness(1)")}
              onTouchStart={() =>
                setDecreaseButtonBrightness("brightness(0.5)")
              }
              onTouchEnd={() => setDecreaseButtonBrightness("brightness(1)")}
              onClick={() => {
                setNumberOfLyricsToShow((prevNum) => prevNum - 50);
              }}
              className={"changeShownLyricAmount"}
            >
              Show 50 less
            </button>
            <button
              style={{ filter: increaseButtonBrightness }}
              disabled={
                userLyricsSortedByLength &&
                numberOfLyricsToShow >= userLyricsSortedByLength.length
                  ? true
                  : false
              }
              onMouseDown={() => setIncreaseButtonBrightness("brightness(0.5)")}
              onMouseUp={() => setIncreaseButtonBrightness("brightness(1)")}
              onMouseEnter={() =>
                setIncreaseButtonBrightness("brightness(0.7)")
              }
              onMouseLeave={() => setIncreaseButtonBrightness("brightness(1)")}
              onTouchStart={() =>
                setIncreaseButtonBrightness("brightness(0.5)")
              }
              onTouchEnd={() => setIncreaseButtonBrightness("brightness(1)")}
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
          padding={2} // optional value, number that set the padding between bubbles
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
