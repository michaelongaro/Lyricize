import { Request, Response } from "express";

import { UserLyrics } from "../models/lyrics.js";

export const isUserInDatabase = async (req: Request, res: Response) => {
  const currentUsername = req.body.currentUsername;

  UserLyrics.find({ spotifyUsername: currentUsername })
    .exec()
    .then((response) => {
      if (response.length > 0) {
        res.json(response[0]["sortedLyrics"]);
      }
    });
};
