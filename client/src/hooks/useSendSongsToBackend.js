import { useEffect } from "react";
import axios from "axios";
export default function useSendSongsToBackend(currentUsername, userSongList, totalLikedSongs, setUserLyrics, setGlobalLyrics, setRefreshLyrics) {
    useEffect(() => {
        if (currentUsername &&
            userSongList &&
            userSongList.length === totalLikedSongs) {
            console.log("posting with", currentUsername, userSongList, userSongList.length, totalLikedSongs);
            // debugger;
            axios
                .post("http://localhost:5001/user-songs", {
                currentUsername,
                userSongList,
            })
                .then((res) => {
                setUserLyrics(res.data.user);
                setGlobalLyrics(res.data.global);
                setRefreshLyrics(false);
            })
                .catch(() => {
                // workaround for weird ts interaction
                window.location = "/";
            });
        }
    }, [userSongList, totalLikedSongs, currentUsername]);
}
