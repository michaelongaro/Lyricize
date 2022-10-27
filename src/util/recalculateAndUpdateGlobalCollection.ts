import { UserLyrics, GlobalLyrics } from "../models/lyrics";
import appendLyricToArray from "./appendLyricToArray";
import sortLyricsByOccurances from "./sortLyricsByOccurances";

const recalculateAndUpdateGlobalCollection = (
  updatedTotalUserLyrics: [string, number][]
) => {
  // @ts-ignore
  let cominedLyricCount = [];

  UserLyrics.find({})
    .exec()
    .then((response) => {
      if (response.length > 0) {
        for (const user of response) {
          cominedLyricCount.push(user.sortedLyrics);
        }

        // @ts-ignore
        for (const lyric of cominedLyricCount.flat()) {
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
      }
    });
};

export default recalculateAndUpdateGlobalCollection;
