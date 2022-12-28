import { Response } from "express";
import { UserLyrics, GlobalLyrics } from "../models/lyrics.js";
import appendLyricToArray from "./appendLyricToArray.js";
import sortLyricsByOccurances from "./sortLyricsByOccurances.js";

const recalculateAndUpdateGlobalCollection = (
  finalUserResult: [string, number][],
  uid: string,
  res: Response
) => {
  // @ts-ignore
  let combinedLyricCount = [];
  let updatedTotalUserLyrics: [string, number][] = [];

  UserLyrics.find({})
    .exec()
    .then((response) => {
      if (response.length > 0) {
        for (const user of response) {
          combinedLyricCount.push(user.sortedLyrics);
        }

        // @ts-ignore
        for (const lyric of combinedLyricCount.flat()) {
          updatedTotalUserLyrics = appendLyricToArray(
            updatedTotalUserLyrics,
            // @ts-ignore
            lyric[0],
            // @ts-ignore
            lyric[1]
          );
        }

        GlobalLyrics.findOneAndUpdate(
          {},
          {
            sortedLyrics: sortLyricsByOccurances(updatedTotalUserLyrics),
          },
          { upsert: true },
          function (err, doc) {
            if (err) console.error("failed", err);
          }
        );

        res.json({
          user: finalUserResult,
          global: updatedTotalUserLyrics,
          uid: uid,
        });
      }
    });
};

export default recalculateAndUpdateGlobalCollection;
