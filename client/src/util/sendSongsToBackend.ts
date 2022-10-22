// import { useState } from "react";
import axios from "axios";

export default function sendSongsToBackend(
  currentUsername: string,
  songs: string[]
) {
  // const [sortedLyrics, setSortedLyrics] = useState();

  axios
    .post("/user-songs", {
      currentUsername,
      songs,
    })
    .then((res) => {
      // setSortedLyrics(res.data);
      return res.data;
    })
    .catch(() => {
      // workaround for weird ts interaction
      (window as Window).location = "/";
    });

  // return sortedLyrics;
}
