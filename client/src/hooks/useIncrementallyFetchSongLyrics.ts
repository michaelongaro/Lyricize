import React, { useEffect } from "react";

import axios from "axios";

export default function useIncrementallyFetchSongLyrics(
  currentUsername: string | null,
  userSongList: string[] | null,
  totalLikedSongs: number | null,
  incrementalIndex: number,
  setIncrementalIndex: React.Dispatch<React.SetStateAction<number>>,
  incrementalUserLyrics: [string, number][],
  setIncrementalUserLyrics: React.Dispatch<
    React.SetStateAction<[string, number][]>
  >,
  currentlyFetchingSongs: boolean,
  setCurrentlyFetchingSongs: React.Dispatch<React.SetStateAction<boolean>>,
  setUserLyrics: React.Dispatch<
    React.SetStateAction<[string, number][] | null>
  >,
  setGlobalLyrics: React.Dispatch<
    React.SetStateAction<[string, number][] | null>
  >,
  setUserID: React.Dispatch<React.SetStateAction<string | null>>,
  setRefreshLyrics: React.Dispatch<React.SetStateAction<boolean>>
) {
  useEffect(() => {
    if (
      currentUsername &&
      userSongList &&
      userSongList.length >= totalLikedSongs! - 50 && // adds buffer in case certain songs couldn't be found
      incrementalIndex !== -1 &&
      !currentlyFetchingSongs
    ) {
      const nextSongChunk = userSongList.slice(
        incrementalIndex,
        incrementalIndex + 5
      );

      axios
        .post(import.meta.env.VITE_BACKEND_URL + "/user-songs", {
          nextSongChunk: nextSongChunk,
          prevUserLyrics: incrementalUserLyrics,
        })
        .then((userSongsRes) => {
          if (
            userSongList?.length &&
            incrementalIndex + 5 < userSongList.length
          ) {
            setIncrementalUserLyrics(userSongsRes.data);
            setIncrementalIndex((prev) => prev + 5);
          } else {
            axios
              .post(import.meta.env.VITE_BACKEND_URL + "/update-database", {
                currentUsername: currentUsername,
                finalUserResult: userSongsRes.data,
              })
              .then((updateDatabaseRes) => {
                setUserLyrics(updateDatabaseRes.data.user);
                setGlobalLyrics(updateDatabaseRes.data.global);
                setUserID(updateDatabaseRes.data.uid);
                setRefreshLyrics(false);
              })
              .catch(() => {
                // workaround for weird ts interaction
                (window as Window).location = "/";
              });
            setIncrementalIndex(-1);
          }
          setCurrentlyFetchingSongs(false);
        })
        .catch(() => {
          // workaround for weird ts interaction
          (window as Window).location = "/";
          setCurrentlyFetchingSongs(false);
        });
      setCurrentlyFetchingSongs(true);
    }
  }, [
    userSongList,
    totalLikedSongs,
    currentUsername,
    incrementalUserLyrics,
    incrementalIndex,
    currentlyFetchingSongs,
  ]);
}
