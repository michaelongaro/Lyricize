import { createContext, useEffect, useState } from "react";

import SpotifyWebApi from "spotify-web-api-node";

import { useFetchUserLyrics } from "../hooks/useFetchUserLyrics";
import useIncrementallyFetchSongLyrics from "../hooks/useIncrementallyFetchSongLyrics";
interface ISpotifyContext {
  accessToken: string | null;
  setAccessToken: React.Dispatch<React.SetStateAction<string | null>>;

  userSongList: string[] | null;
  totalLikedSongs: number | null;

  incrementalIndex: number;
  setIncrementalIndex: React.Dispatch<React.SetStateAction<number>>;
  incrementalUserLyrics: [string, number][] | null;
  setIncrementalUserLyrics: React.Dispatch<
    React.SetStateAction<[string, number][]>
  >;

  // dont know if you need to expose all of this
  userLyrics: [string, number][] | null;
  setUserLyrics: React.Dispatch<
    React.SetStateAction<[string, number][] | null>
  >;
  globalLyrics: [string, number][] | null;
  setGlobalLyrics: React.Dispatch<
    React.SetStateAction<[string, number][] | null>
  >;
  userID: string | null;

  refreshLyrics: boolean;
  setRefreshLyrics: React.Dispatch<React.SetStateAction<boolean>>;

  currentlySelectedLyrics: [string, number][] | null;
  setCurrentlySelectedLyrics: React.Dispatch<
    React.SetStateAction<[string, number][] | null>
  >;

  showUserLyrics: boolean;
  setShowUserLyrics: React.Dispatch<React.SetStateAction<boolean>>;

  currentPFP: string | null;
  currentUsername: string | null;
  setCurrentUsername: React.Dispatch<React.SetStateAction<string | null>>;
}

const SpotifyContext = createContext<ISpotifyContext | null>(null);

const spotifyApi = new SpotifyWebApi({
  clientId: "013a8341148c440caa3fe56fa4742c7c",
});

export function SpotifyProvider(props: any) {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const [userSongList, setUserSongList] = useState<string[] | null>(null);
  const [totalLikedSongs, setTotalLikedSongs] = useState<number | null>(null);

  const [currentPFP, setCurrentPFP] = useState<string | null>(null);
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);

  const [incrementalUserLyrics, setIncrementalUserLyrics] = useState<
    [string, number][]
  >([]);
  const [incrementalIndex, setIncrementalIndex] = useState<number>(0);
  const [currentlyFetchingSongs, setCurrentlyFetchingSongs] =
    useState<boolean>(false);

  const [userLyrics, setUserLyrics] = useState<[string, number][] | null>(null);
  const [globalLyrics, setGlobalLyrics] = useState<[string, number][] | null>(
    null
  );
  const [userID, setUserID] = useState<string | null>(null);

  const [currentlySelectedLyrics, setCurrentlySelectedLyrics] = useState<
    [string, number][] | null
  >(null);

  const [showUserLyrics, setShowUserLyrics] = useState<boolean>(true);

  const [refreshLyrics, setRefreshLyrics] = useState<boolean>(false);

  useEffect(() => {
    if (accessToken) {
      spotifyApi.setAccessToken(accessToken); // looks like this is fine to stay up here

      if (!currentUsername) {
        spotifyApi
          .getMe()
          .then((res) => {
            const imageResults = res.body.images;
            if (imageResults && imageResults.length > 0) {
              setCurrentPFP(imageResults[0].url);
            }
            setCurrentUsername(res.body.id);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  }, [accessToken, currentUsername]);

  useEffect(() => {
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
    setUserID,
    setRefreshLyrics
  );

  useIncrementallyFetchSongLyrics(
    currentUsername,
    userSongList,
    totalLikedSongs,
    incrementalIndex,
    setIncrementalIndex,
    incrementalUserLyrics,
    setIncrementalUserLyrics,
    currentlyFetchingSongs,
    setCurrentlyFetchingSongs,
    setUserLyrics,
    setGlobalLyrics,
    setUserID,
    setRefreshLyrics
  );

  // relook at this after because I think it breaks the rule of having
  // multiple effects chained together..

  useEffect(() => {
    if (refreshLyrics) {
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

  const context: ISpotifyContext = {
    accessToken,
    setAccessToken,
    userSongList,
    totalLikedSongs,
    incrementalIndex,
    setIncrementalIndex,
    incrementalUserLyrics,
    setIncrementalUserLyrics,
    userLyrics,
    setUserLyrics,
    globalLyrics,
    setGlobalLyrics,
    userID,
    refreshLyrics,
    setRefreshLyrics,
    currentlySelectedLyrics,
    setCurrentlySelectedLyrics,
    showUserLyrics,
    setShowUserLyrics,
    currentPFP,
    currentUsername,
    setCurrentUsername,
  };

  return (
    <SpotifyContext.Provider value={context}>
      {props.children}
    </SpotifyContext.Provider>
  );
}

export default SpotifyContext;
