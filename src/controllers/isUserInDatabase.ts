import { Request, Response } from "express";

import { GlobalLyrics, UserLyrics } from "../models/lyrics.js";

export const isUserInDatabase = async (req: Request, res: Response) => {
  const currentUsername = req.body.currentUsername;

  console.log("at least made it this far before timing out"); // push to heroku and try this in the morning

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
      } else {
        res.json({
          user: [],
          global: [],
        });
      }
    });
};
