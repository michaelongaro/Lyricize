import { useState, useContext, useEffect } from "react";

import SpotifyContext from "../../context/SpotifyContext";
import useAuth from "../../hooks/useAuth";
import { useFetchSharedUserLyrics } from "../../hooks/useFetchSharedUserLyrics";

import LyricTable from "./LyricTable";
import LyricMap from "./LyricMap";

import PersonalGlobalToggle from "../PersonalGlobalToggle/PersonalGlobalToggle";
import UserData from "../UserData/UserData";

import { AnimatePresence } from "framer-motion";

import mapIcon from "../../assets/map.svg";
import listIcon from "../../assets/list.svg";

import "../../index.scss";

type Props = {
  code?: string;
  userIDBeingSearched?: string;
};

function MapTableToggle({ code, userIDBeingSearched }: Props) {
  const spotifyCtx = useContext(SpotifyContext);

  let accessToken: string | null = null;
  if (code) {
    accessToken = useAuth(code);
  }

  const [showSharedUserData, setShowSharedUserData] = useState<boolean>(false);
  const [mapSelected, setMapSelected] = useState(true);

  useFetchSharedUserLyrics(
    userIDBeingSearched,
    spotifyCtx!.setUserLyrics,
    spotifyCtx!.setCurrentUsername
  );

  useEffect(() => {
    if (userIDBeingSearched) {
      setShowSharedUserData(true);
    }
  }, [userIDBeingSearched]);

  useEffect(() => {
    if (spotifyCtx && accessToken) {
      spotifyCtx.setAccessToken(accessToken);
    }
  }, [accessToken, spotifyCtx]);

  return (
    <div style={{ gap: "1.5rem" }} className={"baseVertFlex"}>
      {!showSharedUserData && <PersonalGlobalToggle />}

      {spotifyCtx?.showUserLyrics && <UserData />}

      <div
        style={{
          marginTop: spotifyCtx?.showUserLyrics ? 0 : "2rem",
        }}
        className={"buttonContainer baseFlex"}
      >
        <button
          style={{ gap: ".5rem" }}
          className={`${mapSelected ? "toggledOn" : ""} baseFlex`}
          onClick={() => setMapSelected(true)}
        >
          <img
            src={mapIcon}
            style={{
              width: "1.5rem",
              height: "1.5rem",
            }}
            alt={"Bubble map icon"}
          />
          Map
        </button>
        <button
          style={{ gap: ".5rem" }}
          className={`${!mapSelected ? "toggledOn" : ""} baseFlex`}
          onClick={() => setMapSelected(false)}
        >
          <img
            src={listIcon}
            style={{
              width: "1.5rem",
              height: "1.5rem",
            }}
            alt={"Table icon"}
          />
          List
        </button>
      </div>

      <AnimatePresence>
        {mapSelected ? <LyricMap /> : <LyricTable />}
      </AnimatePresence>
    </div>
  );
}

export default MapTableToggle;
