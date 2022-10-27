import React, { useEffect } from "react";

import axios from "axios";

export default function useSendSongsToBackend(
  currentUsername: string | null,
  userSongList: string[] | null,
  totalLikedSongs: number | null,
  setUserLyrics: React.Dispatch<
    React.SetStateAction<[string, number][] | null>
  >,
  setGlobalLyrics: React.Dispatch<
    React.SetStateAction<[string, number][] | null>
  >,
  setRefreshLyrics: React.Dispatch<React.SetStateAction<boolean>>
) {
  useEffect(() => {
    if (
      currentUsername &&
      userSongList &&
      userSongList.length >= totalLikedSongs! - 50 // adds buffer in case certain songs couldn't be found
    ) {
      axios
        .post(import.meta.env.VITE_BACKEND_URL + "/user-songs", {
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
          (window as Window).location = "/";
        });
    }
  }, [userSongList, totalLikedSongs, currentUsername]);
}
