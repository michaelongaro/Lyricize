import { useEffect, useState } from "react";
import axios from "axios";
export default function useAuth(code) {
    const [accessToken, setAccessToken] = useState();
    const [refreshToken, setRefreshToken] = useState();
    const [expiresIn, setExpiresIn] = useState();
    useEffect(() => {
        axios
            .post("http://localhost:5001/login", {
            code,
        })
            .then((res) => {
            setAccessToken(res.data.accessToken);
            setRefreshToken(res.data.refreshToken);
            setExpiresIn(res.data.expiresIn);
            window.history.pushState({}, "", "/");
        })
            .catch(() => {
            // workaround for weird ts interaction
            window.location = "/";
        });
    }, [code]);
    useEffect(() => {
        if (!refreshToken || !expiresIn)
            return;
        const interval = setInterval(() => {
            axios
                .post("http://localhost:5001/refresh", {
                refreshToken,
            })
                .then((res) => {
                console.log("received", res.data);
                setAccessToken(res.data.accessToken);
                setExpiresIn(res.data.expiresIn);
            })
                .catch(() => {
                // workaround for weird ts interaction
                window.location = "/";
            });
        }, (expiresIn - 60) * 1000);
        return () => clearInterval(interval);
    }, [refreshToken, expiresIn]);
    return accessToken;
}
