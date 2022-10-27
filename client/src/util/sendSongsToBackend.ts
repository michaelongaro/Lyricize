import axios from "axios";

export default function sendSongsToBackend(
  currentUsername: string,
  songs: string[]
) {
  axios
    .post(import.meta.env.VITE_CURRENT_URL + "/user-songs", {
      currentUsername,
      songs,
    })
    .then((res) => {
      return res.data;
    })
    .catch(() => {
      // workaround for weird ts interaction
      (window as Window).location = "/";
    });
}
