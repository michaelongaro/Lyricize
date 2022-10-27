import { Request, Response } from "express";

import Genius from "genius-lyrics";

import { UserLyrics } from "../models/lyrics.js";
import getOccurancesPerLyric from "../util/getOccurancesPerLyrics.js";
import recalculateAndUpdateGlobalCollection from "../util/recalculateAndUpdateGlobalCollection.js";

import sanitizeLyrics from "../util/sanitizeLyrics.js";
import sortLyricsByOccurances from "../util/sortLyricsByOccurances.js";

const Client = new Genius.Client();

export const getLyrics = async (req: Request, res: Response) => {
  const currentUsername = req.body.currentUsername;
  const songs = req.body.userSongList;

  const promises: Promise<string>[] = [];

  for (const song of songs) {
    const songName = song.split(",")[0];
    const artistName = song.split(",")[1];

    const searches = await Client.songs.search(songName + artistName);

    if (searches && searches.length !== 0) {
      promises.push(searches[0].lyrics());
    }
  }

  Promise.allSettled(promises).then((results) => {
    let formattedResults = "";
    for (const result of results) {
      // @ts-ignore
      if (result.value !== "") {
        // @ts-ignore
        formattedResults += sanitizeLyrics(result.value);
      }
    }

    const finalUserResult = sortLyricsByOccurances(
      getOccurancesPerLyric(formattedResults)
    );

    let finalGlobalResult: [string, number][] = [];

    UserLyrics.findOneAndUpdate(
      { spotifyUsername: currentUsername },
      { sortedLyrics: finalUserResult },
      { upsert: true },
      function (err, doc) {
        if (err) {
          console.log("error was:", err);
        } else {
          recalculateAndUpdateGlobalCollection(finalGlobalResult);
          res.json({ user: finalUserResult, global: finalGlobalResult });
        }
      }
    );
  });
};
