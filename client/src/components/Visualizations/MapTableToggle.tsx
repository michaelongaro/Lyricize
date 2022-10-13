import React, { useState, useContext, useEffect } from "react";

import SpotifyContext from "../../context/SpotifyContext";
import useAuth from "../../hooks/useAuth";

import LyricTable from "./LyricTable";
import LyricMap from "./LyricMap";

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
    <div className={"baseVertFlex"}>
      <div
        style={{ gap: "1rem" }}
        className={`${classes.toggleButtonsContainer} baseFlex`}
      >
        <button onClick={() => setMapSelected(true)}>Map</button>
        <button onClick={() => setMapSelected(false)}>List</button>
      </div>

      {mapSelected ? <LyricMap /> : <LyricTable />}
    </div>
  );
}

export default MapTableToggle;
