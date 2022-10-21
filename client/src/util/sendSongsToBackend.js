// import { useState } from "react";
import axios from "axios";
export default function sendSongsToBackend(currentUsername, songs) {
    // const [sortedLyrics, setSortedLyrics] = useState();
    axios
        .post("http://localhost:5001/user-songs", {
        currentUsername,
        songs,
    })
        .then((res) => {
        // setSortedLyrics(res.data);
        return res.data;
    })
        .catch(() => {
        // workaround for weird ts interaction
        window.location = "/";
    });
    // return sortedLyrics;
}
