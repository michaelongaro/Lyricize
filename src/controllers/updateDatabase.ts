import { Request, Response } from "express";

import { UserLyrics } from "../models/lyrics.js";

export const updateDatabase = async (req: Request, res: Response) => {
  let finalGlobalResult: [string, number][] = [];

  UserLyrics.findOneAndUpdate(
    { spotifyUsername: currentUsername },
    { sortedLyrics: req.body.finalUserResult },
    { upsert: true },
    function (err, doc) {
      if (err) {
        console.log("error was:", err);
      } else {
        recalculateAndUpdateGlobalCollection(finalGlobalResult);
        res.json({ user: req.finalUserResult, global: finalGlobalResult });
      }
    }
  );
};
