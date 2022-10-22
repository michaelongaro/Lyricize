import { Request, Response } from "express";
import SpotifyWebApi from "spotify-web-api-node";

export const login = (req: Request, res: Response) => {
  const code = req.body.code;

  const spotifyApi = new SpotifyWebApi({
    redirectUri: "https://fierce-mesa-30544.herokuapp.com",
    clientId: "013a8341148c440caa3fe56fa4742c7c",
    clientSecret: "086befc1c9e04ced86d0e0b8dd019ede",
  });

  spotifyApi
    .authorizationCodeGrant(code)
    .then((data) => {
      res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });
};
