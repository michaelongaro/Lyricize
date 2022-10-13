import React, { createContext, useEffect, useState } from "react";

import SpotifyWebApi from "spotify-web-api-node";
import axios from "axios";

// import useSendSongsToBackend from "../hooks/useSendSongsToBackend";
import sendSongsToBackend from "../util/sendSongsToBackend";

interface ISpotifyContext {
  accessToken: string | null;
  setAccessToken: Function;
  // userSongList: object;
  // setUserSongList: Function;
}

const SpotifyContext = createContext<ISpotifyContext | null>(null);

const spotifyApi = new SpotifyWebApi({
  clientId: "013a8341148c440caa3fe56fa4742c7c",
});

export function SpotifyProvider(props: any) {
  const [accessToken, setAccessToken] = useState(null);
  const [userSongList, setUserSongList] = useState<string[] | null>(null);
  const [totalLikedSongs, setTotalLikedSongs] = useState<number | null>(null);
  const [globalLyrics, setGlobalLyrics] = useState(null);

  useEffect(() => {
    if (accessToken) {
      spotifyApi.setAccessToken(accessToken);

      spotifyApi.getMySavedTracks({ limit: 1 }).then((res) => {
        setTotalLikedSongs(res.body.total);
      });
    }
  }, [accessToken]);

  useEffect(() => {
    if (totalLikedSongs) {
      getAllLikedSongs();
    }
  }, [totalLikedSongs]);

  useEffect(() => {
    if (userSongList && userSongList.length === totalLikedSongs) {
      // useSendSongsToBackend(userSongList);
      sendSongsToBackend(userSongList);
    }
  }, [userSongList, totalLikedSongs]);

  interface IArtist {
    name: string;
  }

  interface ISong {
    track: {
      name: string;
      artists: IArtist[];
    };
  }

  const formatSongs = (songs: ISong[]): string[] => {
    const formattedSongs = [];

    for (const song of songs) {
      const title = song.track.name;
      const artist = song.track.artists[0].name;
      formattedSongs.push(`${title},${artist}`);
    }

    return formattedSongs;
  };

  const getAllLikedSongs = () => {
    let offsetVal = 0;
    let songs: any = []; // narrow later

    while (totalLikedSongs && offsetVal <= totalLikedSongs) {
      spotifyApi
        .getMySavedTracks({ limit: 50, offset: offsetVal })
        .then((res) => {
          songs.push(formatSongs(res.body.items));

          if (offsetVal + 50 > totalLikedSongs) {
            setUserSongList(songs.flat());
          }
        });

      offsetVal += 50;
    }
  };

  const context = { accessToken, setAccessToken };

  return (
    <SpotifyContext.Provider value={context}>
      {props.children}
    </SpotifyContext.Provider>
  );
}

export default SpotifyContext;
