import axios from "axios";

export default function sendSongsToBackend(songs: string[]) {
  // const [accessToken, setAccessToken] = useState();
  // const [refreshToken, setRefreshToken] = useState();
  // const [expiresIn, setExpiresIn] = useState();

  axios
    .post("http://localhost:5001/user-songs", {
      songs,
    })
    .then((res) => {
      // setAccessToken(res.data.accessToken);
      // setRefreshToken(res.data.refreshToken);
      // setExpiresIn(res.data.expiresIn);
      // window.history.pushState({}, "", "/");
      // setSortedLyrics();
    })
    .catch(() => {
      // workaround for weird ts interaction
      (window as Window).location = "/";
    });

  // return sortedLyrics;
}
