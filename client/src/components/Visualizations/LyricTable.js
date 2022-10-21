import { useState, useContext, useEffect } from "react";
import SpotifyContext from "../../context/SpotifyContext";
import LyricLengthFilter from "../LyricLengthFilter/LyricLengthFilter";
import LoadingModal from "../LoadingModal/LoadingModal";
import classes from "./LyricTable.module.css";
import "../../index.css";
function Row({ index, lyric, occurances }) {
    const [trophyEmoji, setTrophyEmoji] = useState();
    useEffect(() => {
        if (index === 0) {
            setTrophyEmoji("🥇");
        }
        else if (index === 1) {
            setTrophyEmoji("🥈");
        }
        else if (index === 2) {
            setTrophyEmoji("🥉");
        }
    }, [index]);
    return (<tr className={classes.row}>
      <td>{trophyEmoji ? trophyEmoji : index}</td>
      <td>{lyric}</td>
      <td>{occurances.toLocaleString()}</td>
    </tr>);
}
function LyricTable({}) {
    const spotifyCtx = useContext(SpotifyContext);
    const [userLyricsSortedByLength, setUserLyricsSortedByLength] = useState(null);
    const [numberOfLyricsToShow, setNumberOfLyricsToShow] = useState(50);
    useEffect(() => {
        console.log("typeof is now", typeof userLyricsSortedByLength, " and length is now:", userLyricsSortedByLength?.length, userLyricsSortedByLength);
    }, [userLyricsSortedByLength]);
    useEffect(() => {
        if (spotifyCtx?.currentlySelectedLyrics) {
            setUserLyricsSortedByLength(spotifyCtx.userLyrics);
        }
    }, [spotifyCtx?.currentlySelectedLyrics]);
    useEffect(() => {
        const scrollHandler = () => {
            if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
                if (userLyricsSortedByLength &&
                    numberOfLyricsToShow < userLyricsSortedByLength.length) {
                    setNumberOfLyricsToShow((prevNum) => prevNum + 50);
                }
            }
        };
        window.addEventListener("scroll", scrollHandler);
        return () => {
            window.removeEventListener("scroll", scrollHandler);
        };
    }, [userLyricsSortedByLength, numberOfLyricsToShow]);
    return (<div className={`${classes.headerTableContainer} baseVertFlex`}>
      {spotifyCtx?.currentlySelectedLyrics && (<LyricLengthFilter originalUserLyrics={spotifyCtx.currentlySelectedLyrics} setFilteredUserLyrics={setUserLyricsSortedByLength}/>)}

      {userLyricsSortedByLength && !spotifyCtx?.refreshLyrics ? (<div style={{ borderRadius: ".75rem" }}>
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
                .slice(0, numberOfLyricsToShow)
                .map((elem, i) => {
                return (<Row key={i} index={i} lyric={elem[0]} occurances={elem[1]}/>);
            })}
            </tbody>
          </table>
        </div>) : (<LoadingModal />)}
    </div>);
}
export default LyricTable;
