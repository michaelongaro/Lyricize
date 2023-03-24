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

import classes from "./MapTableToggle.module.css";
import "../../index.css";

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
          <img src={mapIcon} className={classes.icon} alt={"Bubble map icon"} />
          Map
        </button>
        <button
          style={{ gap: ".5rem" }}
          className={`${!mapSelected ? "toggledOn" : ""} baseFlex`}
          onClick={() => setMapSelected(false)}
        >
          <img src={listIcon} className={classes.icon} alt={"Table icon"} />
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
