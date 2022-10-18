import { createContext, useEffect, useState } from "react";

import SpotifyWebApi from "spotify-web-api-node";
import { useFetchUserLyrics } from "../hooks/useFetchUserLyrics";

// import useSendSongsToBackend from "../hooks/useSendSongsToBackend";
import sendSongsToBackend from "../util/sendSongsToBackend";

interface ISpotifyContext {
  accessToken: string | null;
  setAccessToken: Function;
  userLyrics: [string, number][] | boolean | null;
  setUserLyrics: Function;
  currentPFP: string | null;
  currentUsername: string | null;
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

  const [currentPFP, setCurrentPFP] = useState<string | null>(null);
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);
  const [userLyrics, setUserLyrics] = useState<
    [string, number][] | boolean | null
  >(null);

  useEffect(() => {
    if (accessToken) {
      spotifyApi.setAccessToken(accessToken); // looks like this is fine to stay up here

      spotifyApi.getMe().then((res) => {
        console.log("details:", res.body);
        const imageResults = res.body.images;
        if (imageResults && imageResults.length > 0) {
          setCurrentPFP(imageResults[0].url);
        } else {
          // make it falsey in some way
          setCurrentPFP("User has no PFP");
        }
        setCurrentUsername(res.body.id);
      });
    }
  }, [accessToken]);

  // idk if this is worth having in custom hook but it should work
  useFetchUserLyrics(currentUsername, setUserLyrics);

  // relook at this after because I think it breaks the rule of having
  // multiple effects chained together..

  useEffect(() => {
    console.log("userLyrics came back with", userLyrics);

    if (userLyrics === false) {
      console.log("hopefully going in hyaaa");

      spotifyApi.getMySavedTracks({ limit: 1 }).then((res) => {
        setTotalLikedSongs(res.body.total);
      });
    }
  }, [userLyrics]);

  useEffect(() => {
    if (totalLikedSongs) {
      getAllLikedSongs();
    }
  }, [totalLikedSongs]);

  useEffect(() => {
    if (
      currentUsername &&
      userSongList &&
      userSongList.length === totalLikedSongs
    ) {
      sendSongsToBackend(currentUsername, userSongList);
    }
  }, [userSongList, totalLikedSongs, currentUsername]);

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

  const context = {
    accessToken,
    setAccessToken,
    userLyrics,
    setUserLyrics,
    currentPFP,
    currentUsername,
  };

  return (
    <SpotifyContext.Provider value={context}>
      {props.children}
    </SpotifyContext.Provider>
  );
}

export default SpotifyContext;
