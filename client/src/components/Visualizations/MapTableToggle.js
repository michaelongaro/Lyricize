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
function MapTableToggle({ code }) {
    const spotifyCtx = useContext(SpotifyContext);
    const accessToken = useAuth(code);
    const [mapSelected, setMapSelected] = useState(true);
    useEffect(() => {
        console.log("access token", accessToken);
        if (accessToken) {
            spotifyCtx?.setAccessToken(accessToken);
        }
    }, [accessToken]);
    return (<div style={{ gap: "1.5rem" }} className={"baseVertFlex"}>
      <PersonalGlobalToggle />

      <UserData />

      <div className={"buttonContainer baseFlex"}>
        <button onClick={() => setMapSelected(true)} style={{ gap: ".5rem" }} className={`${mapSelected ? "toggledOn" : ""} baseFlex`}>
          <img src={mapIcon} className={classes.icon}/>
          Map
        </button>
        <button onClick={() => setMapSelected(false)} style={{ gap: ".5rem" }} className={`${!mapSelected ? "toggledOn" : ""} baseFlex`}>
          <img src={listIcon} className={classes.icon}/>
          List
        </button>
      </div>
      {mapSelected ? <LyricMap /> : <LyricTable />}
    </div>);
}
export default MapTableToggle;
