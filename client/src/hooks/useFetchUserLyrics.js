import { useEffect } from "react";
import axios from "axios";
export const useFetchUserLyrics = (currentUsername, setUserLyrics, setGlobalLyrics, setRefreshLyrics) => {
    console.log("inside hook:", currentUsername);
    useEffect(() => {
        if (currentUsername) {
            axios
                .post("http://localhost:5001/is-user-in-database", {
                currentUsername,
            })
                .then((res) => {
                console.log("data received was", res);
                if (res.data.user.length && res.data.global.length) {
                    setUserLyrics(res.data.user);
                    setGlobalLyrics(res.data.global);
                }
                else {
                    setRefreshLyrics(true);
                }
            })
                .catch(() => {
                // workaround for weird ts interaction
                window.location = "/";
            });
        }
    }, [currentUsername]);
};
