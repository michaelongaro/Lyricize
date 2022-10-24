import { createContext, useEffect, useState } from "react";

import SpotifyWebApi from "spotify-web-api-node";

import { useFetchUserLyrics } from "../hooks/useFetchUserLyrics";
import useSendSongsToBackend from "../hooks/useSendSongsToBackend";

interface ISpotifyContext {
  accessToken: string | null;
  setAccessToken: Function; // these should be proper react setState types

  totalLikedSongs: number | null;

  // dont know if you need to expose all of this
  userLyrics: [string, number][] | null;
  setUserLyrics: Function;
  globalLyrics: [string, number][] | null;
  setGlobalLyrics: Function;

  refreshLyrics: boolean; // needed later for the loading spinner?
  setRefreshLyrics: Function;

  currentlySelectedLyrics: [string, number][] | null;
  setCurrentlySelectedLyrics: Function;

  showUserLyrics: boolean;
  setShowUserLyrics: React.Dispatch<React.SetStateAction<boolean>>;

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

  const [currentPFP, setCurrentPFP] = useState<string | null>(null);
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);

  const [userLyrics, setUserLyrics] = useState<[string, number][] | null>(null);
  const [globalLyrics, setGlobalLyrics] = useState<[string, number][] | null>(
    null
  );

  const [currentlySelectedLyrics, setCurrentlySelectedLyrics] = useState<
    [string, number][] | null
  >(null);

  const [showUserLyrics, setShowUserLyrics] = useState<boolean>(true);

  const [refreshLyrics, setRefreshLyrics] = useState<boolean>(false);

  useEffect(() => {
    if (accessToken) {
      spotifyApi.setAccessToken(accessToken); // looks like this is fine to stay up here

      spotifyApi
        .getMe()
        .then((res) => {
          const imageResults = res.body.images;
          if (imageResults && imageResults.length > 0) {
            setCurrentPFP(imageResults[0].url);
          } else {
            // make it falsey in some way
            setCurrentPFP("User has no PFP");
          }
          setCurrentUsername(res.body.id);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [accessToken]);

  useEffect(() => {
    console.log(showUserLyrics, userLyrics, globalLyrics);
    if (showUserLyrics) {
      setCurrentlySelectedLyrics(userLyrics);
    } else {
      setCurrentlySelectedLyrics(globalLyrics);
    }
  }, [userLyrics, globalLyrics, showUserLyrics]);

  // is this a proper situation/setup for hooks?
  useFetchUserLyrics(
    currentUsername,
    setUserLyrics,
    setGlobalLyrics,
    setRefreshLyrics
  );

  useSendSongsToBackend(
    currentUsername,
    userSongList,
    totalLikedSongs,
    setUserLyrics,
    setGlobalLyrics,
    setRefreshLyrics
  );

  // relook at this after because I think it breaks the rule of having
  // multiple effects chained together..

  useEffect(() => {
    if (refreshLyrics) {
      console.log("refreshing lyrics");

      spotifyApi.getMySavedTracks({ limit: 1 }).then((res) => {
        setTotalLikedSongs(res.body.total);
      });
    }
  }, [refreshLyrics]);

  useEffect(() => {
    if (totalLikedSongs) {
      getAllLikedSongs();
    }
  }, [totalLikedSongs]);

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
    totalLikedSongs,
    userLyrics,
    setUserLyrics,
    globalLyrics,
    setGlobalLyrics,
    refreshLyrics,
    setRefreshLyrics,
    currentlySelectedLyrics,
    setCurrentlySelectedLyrics,
    showUserLyrics,
    setShowUserLyrics,
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
