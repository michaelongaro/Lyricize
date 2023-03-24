import { useState, useContext, useEffect } from "react";
import SpotifyContext from "../../context/SpotifyContext";

import LyricLengthFilter from "../LyricLengthFilter/LyricLengthFilter";

import LoadingModal from "../LoadingModal/LoadingModal";
import ScrollToTop from "../ScrollToTop/ScrollToTop";

import { motion } from "framer-motion";

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
      <td style={{ fontSize: trophyEmoji ? "1.25rem" : "1rem" }}>
        {trophyEmoji ? trophyEmoji : index + 1}
      </td>
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

  const [numberOfLyricsToShow, setNumberOfLyricsToShow] = useState<number>(50);

  useEffect(() => {
    const scrollHandler = () => {
      if (
        window.innerHeight + Math.round(window.scrollY) >=
        document.body.scrollHeight - 100
      ) {
        if (
          userLyricsSortedByLength &&
          numberOfLyricsToShow < userLyricsSortedByLength.length
        ) {
          setNumberOfLyricsToShow((prevNum) => prevNum + 50);
        }
      }
    };

    window.addEventListener("scroll", scrollHandler);

    return () => {
      window.removeEventListener("scroll", scrollHandler);
    };
  }, [userLyricsSortedByLength, numberOfLyricsToShow]);

  return (
    <motion.div
      key={"lyricTable"}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className={`${classes.headerTableContainer} baseVertFlex`}
    >
      {spotifyCtx?.currentlySelectedLyrics && (
        <LyricLengthFilter
          originalUserLyrics={spotifyCtx.currentlySelectedLyrics}
          setFilteredUserLyrics={setUserLyricsSortedByLength}
        />
      )}

      {userLyricsSortedByLength && !spotifyCtx?.refreshLyrics ? (
        <>
          <table className={classes.table}>
            <thead className={`${classes.row} ${classes.legendRow}`}>
              <tr>
                <th style={{ fontSize: "1.25rem" }}>🏆</th>
                <th>Lyric</th>
                <th>Occurances</th>
              </tr>
            </thead>

            <tbody>
              {userLyricsSortedByLength
                .slice(0, numberOfLyricsToShow)
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
          <ScrollToTop />
        </>
      ) : (
        <LoadingModal />
      )}
    </motion.div>
  );
}

export default LyricTable;
