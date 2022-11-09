import React, { useEffect, useContext } from "react";

import axios from "axios";

import SpotifyContext from "../context/SpotifyContext";

export default function useIncrementallyFetchSongLyrics() {
  // spotifyCtx.currentUsername: string | null,
  // spotifyCtx.userSongList: string[] | null,
  // spotifyCtx.totalLikedSongs: number | null,
  // incrementalIndex: number,
  // incrementalUserLyrics: string[] | null,
  // setIncrementalUserLyrics: React.Dispatch<
  //   React.SetStateAction<[string, number][] | null>
  // >,
  // setUserLyrics: React.Dispatch<
  //   React.SetStateAction<[string, number][] | null>
  // >,
  // setGlobalLyrics: React.Dispatch<
  //   React.SetStateAction<[string, number][] | null>
  // >,
  // setRefreshLyrics: React.Dispatch<React.SetStateAction<boolean>>
  const spotifyCtx = useContext(SpotifyContext);

  useEffect(() => {
    if (
      spotifyCtx.currentUsername &&
      spotifyCtx.userSongList &&
      spotifyCtx.userSongList.length >= spotifyCtx.totalLikedSongs! - 50 && // adds buffer in case certain songs couldn't be found
      spotifyCtx.incrementalIndex !== -2 // idk why you didn't do -1
    ) {
      const nextSongChunk = spotifyCtx.userSongList.slice(
        spotifyCtx.incrementalIndex,
        spotifyCtx.incrementalIndex + 20
      );

      axios
        .post(import.meta.env.VITE_BACKEND_URL + "/user-songs", {
          currentUsername: spotifyCtx.currentUsername,
          nextSongChunk: nextSongChunk,
          userLyrics: spotifyCtx.userLyrics,
        })
        .then((userSongsRes) => {
          if (incrementalIndex + 20 < spotifyCtx.userSongList.length) {
            spotifyCtx.setIncrementalUserLyrics(userSongsRes.data);
            spotifyCtx.setIncrementalIndex((prev) => prev + 20);
          } else {
            axios
              .post(import.meta.env.VITE_BACKEND_URL + "/update-database", {
                finalUserResult: userSongsRes.data,
              })
              .then((updateDatabaseRes) => {
                spotifyCtx.setUserLyrics(updateDatabaseRes.data.user);
                spotifyCtx.setGlobalLyrics(updateDatabaseRes.data.global);
                spotifyCtx.setRefreshLyrics(false);
              })
              .catch(() => {
                // workaround for weird ts interaction
                (window as Window).location = "/";
              });
            spotifyCtx.setIncrementalUserLyrics(-2);
          }
        })
        .catch(() => {
          // workaround for weird ts interaction
          (window as Window).location = "/";
        });
    }
  }, [
    spotifyCtx.userSongList,
    spotifyCtx.totalLikedSongs,
    spotifyCtx.currentUsername,
    spotifyCtx.incrementalUserLyrics,
    spotifyCtx.incrementalIndex,
  ]);
}
