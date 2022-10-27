import { useEffect, useState } from "react";

import axios from "axios";

export default function useAuth(code: string) {
  const [accessToken, setAccessToken] = useState();
  const [refreshToken, setRefreshToken] = useState();
  const [expiresIn, setExpiresIn] = useState();

  useEffect(() => {
    axios
      .post(import.meta.env.VITE_BACKEND_URL + "/login", {
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
        (window as Window).location = "/";
      });
  }, [code]);

  useEffect(() => {
    if (!refreshToken || !expiresIn) return;

    const interval = setInterval(() => {
      axios
        .post(import.meta.env.VITE_BACKEND_URL + "/refresh", {
          refreshToken,
        })
        .then((res) => {
          console.log("received", res.data);

          setAccessToken(res.data.accessToken);
          setExpiresIn(res.data.expiresIn);
        })
        .catch(() => {
          // workaround for weird ts interaction
          (window as Window).location = "/";
        });
    }, (expiresIn - 60) * 1000);

    return () => clearInterval(interval);
  }, [refreshToken, expiresIn]);

  return accessToken;
}
