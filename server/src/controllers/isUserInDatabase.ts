import { Request, Response } from "express";

import { GlobalLyrics, UserLyrics } from "../models/lyrics.js";

export const isUserInDatabase = async (req: Request, res: Response) => {
  const currentUsername = req.body.currentUsername;

  UserLyrics.find({ spotifyUsername: currentUsername })
    .exec()
    .then((userResponse) => {
      if (userResponse.length > 0) {
        GlobalLyrics.find({})
          .exec()
          .then((globalResponse) => {
            if (globalResponse.length > 0) {
              res.json({
                user: userResponse[0]["sortedLyrics"],
                global: globalResponse[0]["sortedLyrics"],
              });
            }
          });
      }
    });
};
