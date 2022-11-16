import { Request, Response } from "express";

import { GlobalLyrics, UserLyrics } from "../models/lyrics.js";

export const isUserInDatabase = async (req: Request, res: Response) => {
  const currentUsername = req.body?.currentUsername;
  const currentID = req.body?.uid;

  interface ISearchCriteria {
    spotifyUsername?: string;
    shortUUID?: string;
  }

  let searchCriteria: ISearchCriteria = {};
  if (currentUsername) {
    searchCriteria = { spotifyUsername: currentUsername };
  } else if (currentID) {
    searchCriteria = { shortUUID: currentID };
  }

  UserLyrics.find(searchCriteria)
    .exec()
    .then((userResponse) => {
      if (userResponse.length > 0) {
        GlobalLyrics.find({})
          .exec()
          .then((globalResponse) => {
            if (globalResponse.length > 0) {
              res.json({
                user: userResponse[0]["sortedLyrics"],
                spotifyUsername: userResponse[0]["spotifyUsername"],
                uid: userResponse[0]["shortUUID"],
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
