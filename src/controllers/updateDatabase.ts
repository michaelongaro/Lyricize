import { Request, Response } from "express";
import ShortUniqueId from "short-unique-id";

import { UserLyrics } from "../models/lyrics.js";

import recalculateAndUpdateGlobalCollection from "../util/recalculateAndUpdateGlobalCollection.js";

export const updateDatabase = async (req: Request, res: Response) => {
  const currentUsername = req.body.currentUsername;
  const finalUserResult = req.body.finalUserResult;

  // checking to see if user exists in database
  UserLyrics.find({ spotifyUsername: currentUsername })
    .exec()
    .then((userResponse) => {
      if (userResponse.length > 0) {
        userResponse[0].sortedLyrics = finalUserResult;
        userResponse[0].save().then(() => {
          recalculateAndUpdateGlobalCollection(
            finalUserResult,
            userResponse[0].shortUUID,
            res
          );
        });
      }
      // adding new user doc to collection
      else {
        const uid = new ShortUniqueId({ length: 10 });
        const shortUUID = uid();

        UserLyrics.create(
          {
            spotifyUsername: currentUsername,
            shortUUID: shortUUID,
            sortedLyrics: finalUserResult,
          },
          () => {
            recalculateAndUpdateGlobalCollection(
              finalUserResult,
              shortUUID,
              res
            );
          }
        );
      }
    });
};
