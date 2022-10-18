import { useEffect } from "react";
import axios from "axios";

export const useFetchUserLyrics = (
  currentUsername: string | null,
  setUserLyrics: React.Dispatch<
    React.SetStateAction<boolean | [string, number][] | null>
  >
): [string, number][] | boolean => {
  console.log("inside hook:", currentUsername);

  useEffect(() => {
    if (currentUsername) {
      axios
        .post("http://localhost:5001/is-user-in-database", {
          currentUsername,
        })
        .then((res) => {
          console.log("data received was", res);

          setUserLyrics(res.data.length === 0 ? false : res.data);
        })
        .catch(() => {
          // workaround for weird ts interaction
          (window as Window).location = "/";
        });
    }
  }, [currentUsername]);

  return false;
};
