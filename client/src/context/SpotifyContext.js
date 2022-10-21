import { createContext, useEffect, useState } from "react";
import SpotifyWebApi from "spotify-web-api-node";
import { useFetchUserLyrics } from "../hooks/useFetchUserLyrics";
import useSendSongsToBackend from "../hooks/useSendSongsToBackend";
const SpotifyContext = createContext(null);
const spotifyApi = new SpotifyWebApi({
    clientId: "013a8341148c440caa3fe56fa4742c7c",
});
export function SpotifyProvider(props) {
    const [accessToken, setAccessToken] = useState(null);
    const [userSongList, setUserSongList] = useState(null);
    const [totalLikedSongs, setTotalLikedSongs] = useState(null);
    const [currentPFP, setCurrentPFP] = useState(null);
    const [currentUsername, setCurrentUsername] = useState(null);
    const [userLyrics, setUserLyrics] = useState(null);
    const [globalLyrics, setGlobalLyrics] = useState(null);
    const [currentlySelectedLyrics, setCurrentlySelectedLyrics] = useState(null);
    const [showUserLyrics, setShowUserLyrics] = useState(true);
    const [refreshLyrics, setRefreshLyrics] = useState(false);
    useEffect(() => {
        if (accessToken) {
            spotifyApi.setAccessToken(accessToken); // looks like this is fine to stay up here
            spotifyApi.getMe().then((res) => {
                const imageResults = res.body.images;
                if (imageResults && imageResults.length > 0) {
                    setCurrentPFP(imageResults[0].url);
                }
                else {
                    // make it falsey in some way
                    setCurrentPFP("User has no PFP");
                }
                setCurrentUsername(res.body.id);
            });
        }
    }, [accessToken]);
    useEffect(() => {
        console.log(showUserLyrics, userLyrics, globalLyrics);
        if (showUserLyrics) {
            setCurrentlySelectedLyrics(userLyrics);
        }
        else {
            setCurrentlySelectedLyrics(globalLyrics);
        }
    }, [userLyrics, globalLyrics, showUserLyrics]);
    // is this a proper situation/setup for hooks?
    useFetchUserLyrics(currentUsername, setUserLyrics, setGlobalLyrics, setRefreshLyrics);
    useSendSongsToBackend(currentUsername, userSongList, totalLikedSongs, setUserLyrics, setGlobalLyrics, setRefreshLyrics);
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
    const formatSongs = (songs) => {
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
        let songs = []; // narrow later
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
    return (<SpotifyContext.Provider value={context}>
      {props.children}
    </SpotifyContext.Provider>);
}
export default SpotifyContext;
// use built-in genius lyrics filter
