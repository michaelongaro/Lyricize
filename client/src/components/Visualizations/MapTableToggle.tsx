import React, { useState, useContext, useEffect } from "react";

import SpotifyContext from "../../context/SpotifyContext";
import useAuth from "../../hooks/useAuth";

import LyricTable from "./LyricTable";
import LyricMap from "./LyricMap";

import PersonalGlobalToggle from "../PersonalGlobalToggle/PersonalGlobalToggle";
import UserData from "../UserData/UserData";

import mapIcon from "../../assets/map.svg";
import listIcon from "../../assets/list.svg";

import classes from "./MapTableToggle.module.css";
import "../../index.css";

type Props = {
  code: string;
};

function MapTableToggle({ code }: Props) {
  const spotifyCtx = useContext(SpotifyContext);

  const accessToken = useAuth(code);
  const [mapSelected, setMapSelected] = useState(true);

  useEffect(() => {
    console.log("access token", accessToken);

    if (accessToken) {
      spotifyCtx?.setAccessToken(accessToken);
    }
  }, [accessToken]);

  return (
    <div style={{ gap: "1.5rem" }} className={"baseVertFlex"}>
      <PersonalGlobalToggle />

      {spotifyCtx?.showUserLyrics && <UserData />}

      <div
        style={{
          marginTop: spotifyCtx?.showUserLyrics ? 0 : "2rem",
        }}
        className={"buttonContainer baseFlex"}
      >
        <button
          onClick={() => setMapSelected(true)}
          style={{ gap: ".5rem" }}
          className={`${mapSelected ? "toggledOn" : ""} baseFlex`}
        >
          <img src={mapIcon} className={classes.icon} alt={"Bubble map icon"} />
          Map
        </button>
        <button
          onClick={() => setMapSelected(false)}
          style={{ gap: ".5rem" }}
          className={`${!mapSelected ? "toggledOn" : ""} baseFlex`}
        >
          <img src={listIcon} className={classes.icon} alt={"Table icon"} />
          List
        </button>
      </div>
      {mapSelected ? <LyricMap /> : <LyricTable />}
    </div>
  );
}

export default MapTableToggle;
