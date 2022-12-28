import { Request, Response } from "express";

import Genius from "genius-lyrics";
import combineLyricArrays from "../util/combineLyricArrays.js";

import getOccurancesPerLyric from "../util/getOccurancesPerLyric.js";

import sanitizeLyrics from "../util/sanitizeLyrics.js";
import sortLyricsByOccurances from "../util/sortLyricsByOccurances.js";

const Client = new Genius.Client();

export const getLyrics = async (req: Request, res: Response) => {
  const nextSongChunk = req.body.nextSongChunk;
  const prevUserLyrics = req.body.prevUserLyrics;

  const promises: Promise<string>[] = [];

  for (const song of nextSongChunk) {
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
      combineLyricArrays(
        prevUserLyrics,
        getOccurancesPerLyric(formattedResults)
      )
    );

    res.json(finalUserResult);
  });
};
