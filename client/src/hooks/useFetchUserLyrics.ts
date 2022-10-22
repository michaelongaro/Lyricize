import { useEffect } from "react";
import axios from "axios";

export const useFetchUserLyrics = (
  currentUsername: string | null,
  setUserLyrics: React.Dispatch<
    React.SetStateAction<[string, number][] | null>
  >,
  setGlobalLyrics: React.Dispatch<
    React.SetStateAction<[string, number][] | null>
  >,
  setRefreshLyrics: React.Dispatch<React.SetStateAction<boolean>>
) => {
  console.log("inside hook:", currentUsername);

  useEffect(() => {
    if (currentUsername) {
      axios
        .post("/is-user-in-database", {
          currentUsername,
        })
        .then((res) => {
          console.log("data received was", res);

          if (res.data.user.length && res.data.global.length) {
            setUserLyrics(res.data.user);
            setGlobalLyrics(res.data.global);
          } else {
            setRefreshLyrics(true);
          }
        })
        .catch(() => {
          // workaround for weird ts interaction
          (window as Window).location = "/";
        });
    }
  }, [currentUsername]);
};
