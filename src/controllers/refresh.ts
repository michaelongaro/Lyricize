import { Request, Response } from "express";
import SpotifyWebApi from "spotify-web-api-node";

export const refresh = (req: Request, res: Response) => {
  const refreshToken = req.body.refreshToken;

  let redirectUri = process.env.VITE_CURRENT_URL!;

  if (redirectUri !== "http://localhost:5000") {
    redirectUri += "/";
  }

  const spotifyApi = new SpotifyWebApi({
    redirectUri: redirectUri,
    clientId: "013a8341148c440caa3fe56fa4742c7c",
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken,
  });

  spotifyApi
    .refreshAccessToken()
    .then((data) => {
      res.json({
        accessToken: data.body.access_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });
};
