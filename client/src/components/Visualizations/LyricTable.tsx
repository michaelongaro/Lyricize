import React, { useState, useContext, useEffect } from "react";
import SpotifyContext from "../../context/SpotifyContext";

import classes from "./LyricTable.module.css";
import "../../index.css";
import UserData from "../UserData/UserData";
import LyricLengthFilter from "../LyricLengthFilter/LyricLengthFilter";

type RowProps = {
  index: number;
  lyric: string;
  occurances: number;
};

function Row({ index, lyric, occurances }: RowProps) {
  const [trophyEmoji, setTrophyEmoji] = useState<string>();

  useEffect(() => {
    if (index === 0) {
      setTrophyEmoji("🥇");
    } else if (index === 1) {
      setTrophyEmoji("🥈");
    } else if (index === 2) {
      setTrophyEmoji("🥉");
    }
  }, [index]);

  return (
    <tr className={classes.row}>
      <td>{trophyEmoji ? trophyEmoji : index}</td>
      <td>{lyric}</td>
      <td>{occurances.toLocaleString()}</td>
    </tr>
  );
}

type Props = {};

function LyricTable({}: Props) {
  const spotifyCtx = useContext(SpotifyContext);

  const [userLyricsSortedByLength, setUserLyricsSortedByLength] = useState<
    [string, number][] | null
  >(null);

  useEffect(() => {
    console.log(
      "typeof is now",
      typeof userLyricsSortedByLength,
      " and length is now:",
      userLyricsSortedByLength?.length,
      userLyricsSortedByLength
    );
  }, [userLyricsSortedByLength]);

  useEffect(() => {
    if (typeof spotifyCtx?.userLyrics === "object" && spotifyCtx.userLyrics) {
      setUserLyricsSortedByLength(spotifyCtx.userLyrics);
    }

    // need to have toggle context state for whether to show user/global data
  }, [spotifyCtx?.userLyrics]);

  return (
    <div className={`${classes.headerTableContainer} baseVertFlex`}>
      {typeof spotifyCtx?.userLyrics === "object" && spotifyCtx?.userLyrics && (
        <LyricLengthFilter
          originalUserLyrics={spotifyCtx.userLyrics}
          setFilteredUserLyrics={setUserLyricsSortedByLength}
        />
      )}

      {userLyricsSortedByLength ? (
        <div style={{ borderRadius: ".75rem" }}>
          <table className={classes.table}>
            <thead className={`${classes.row} ${classes.legendRow}`}>
              <tr>
                <th>🏆</th>
                <th>Lyric</th>
                <th>Occurances</th>
              </tr>
            </thead>

            <tbody>
              {userLyricsSortedByLength
                .slice(0, 10)
                .map((elem: [string, number], i: number) => {
                  return (
                    <Row
                      key={i}
                      index={i}
                      lyric={elem[0]}
                      occurances={elem[1]}
                    />
                  );
                })}
            </tbody>
          </table>
        </div>
      ) : (
        <div>No results found</div>
      )}
    </div>
  );
}

export default LyricTable;
