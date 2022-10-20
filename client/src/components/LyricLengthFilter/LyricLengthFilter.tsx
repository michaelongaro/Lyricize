import { useEffect, useState } from "react";

import classes from "./LyricLengthFilter.module.css";
import "../../index.css";

type Props = {
  originalUserLyrics: [string, number][];
  setFilteredUserLyrics: Function;
};

function LyricLengthFilter({
  originalUserLyrics,
  setFilteredUserLyrics,
}: Props) {
  console.log("OG lyrics are:", originalUserLyrics);

  const [buttonClickedStates, setButtonClickedStates] = useState<boolean[]>([
    false,
    false,
    false,
    false,
    false,
  ]);

  const filterLyricsByLength = (length: number) => {
    if (originalUserLyrics && typeof originalUserLyrics === "object") {
      console.log("entered with", length, originalUserLyrics.length);

      if (length === -1) {
        console.log(originalUserLyrics);

        setFilteredUserLyrics(originalUserLyrics);
        // setFilteredUserLyrics([originalUserLyrics]);
      } else if (length > 6) {
        setFilteredUserLyrics(
          originalUserLyrics.filter((lyric) => lyric[0].length > 6)
        );
      } else {
        setFilteredUserLyrics(
          originalUserLyrics.filter((lyric) => lyric[0].length === length)
        );
      }
    }
  };

  const updateButtonClickedStates = (
    index: number,
    newState: boolean,
    value: number
  ) => {
    const newValues = [false, false, false, false, false];

    newValues[index] = newState;

    console.log("turned ", index, "to ", newState);

    setButtonClickedStates(newValues);

    filterLyricsByLength(newState ? value : -1);
  };

  useEffect(() => {
    if (originalUserLyrics) {
      filterLyricsByLength(-1);
    }
  }, [originalUserLyrics]);

  return (
    <div className={"buttonContainer baseFlex"}>
      <div style={{ marginRight: "1.5rem", color: "rgb(204, 204, 204)" }}>
        Letters
      </div>
      <button
        className={buttonClickedStates[0] ? "toggledOn" : ""}
        onClick={() => updateButtonClickedStates(0, !buttonClickedStates[0], 3)}
      >
        3
      </button>
      <button
        className={buttonClickedStates[1] ? "toggledOn" : ""}
        onClick={() => updateButtonClickedStates(1, !buttonClickedStates[1], 4)}
      >
        4
      </button>
      <button
        className={buttonClickedStates[2] ? "toggledOn" : ""}
        onClick={() => updateButtonClickedStates(2, !buttonClickedStates[2], 5)}
      >
        5
      </button>
      <button
        className={buttonClickedStates[3] ? "toggledOn" : ""}
        onClick={() => updateButtonClickedStates(3, !buttonClickedStates[3], 6)}
      >
        6
      </button>
      <button
        className={buttonClickedStates[4] ? "toggledOn" : ""}
        onClick={() => updateButtonClickedStates(4, !buttonClickedStates[4], 7)}
      >
        7+
      </button>
    </div>
  );
}

export default LyricLengthFilter;
