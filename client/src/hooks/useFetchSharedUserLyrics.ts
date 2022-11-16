import { useEffect } from "react";
import axios from "axios";

export const useFetchSharedUserLyrics = (
  userID: string | undefined,
  setUserLyrics: React.Dispatch<
    React.SetStateAction<[string, number][] | null>
  >,
  setCurrentUsername: React.Dispatch<React.SetStateAction<string | null>>
) => {
  useEffect(() => {
    if (userID) {
      axios
        .post(import.meta.env.VITE_BACKEND_URL + "/is-user-in-database", {
          uid: userID,
        })
        .then((res) => {
          if (res.data.user.length) {
            setUserLyrics(res.data.user);
            setCurrentUsername(res.data.spotifyUsername);
          }
        })
        .catch(() => {
          // workaround for weird ts interaction
          (window as Window).location = "/";
        });
    }
  }, [userID]);
};
