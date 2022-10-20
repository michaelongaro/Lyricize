import { Request, Response } from "express";

import Genius from "genius-lyrics";

import { UserLyrics, GlobalLyrics } from "../models/lyrics.js";

const Client = new Genius.Client();

const sanitizeLyrics = (lyrics: string): string => {
  lyrics = lyrics.slice(0, 1).toUpperCase() + lyrics.slice(1).toLowerCase();

  const firstRegex = /\[[^\]]*\]/gm;
  const secondRegex = /[.,()!{}|?;:"]/gm;

  lyrics = lyrics.replaceAll("\n", " ");
  lyrics = lyrics.replaceAll(firstRegex, " ");
  lyrics = lyrics.replaceAll(secondRegex, " ");

  lyrics = lyrics.trim().replace(/ +/g, " ");

  let words = lyrics.split(" ");

  lyrics = words
    .map((word) => {
      if (word && word[0]) {
        return word[0].toUpperCase() + word.substring(1);
      }
    })
    .join(" ");

  return lyrics;
};

const appendLyricToArray = (
  arr: [string, number][],
  lyric: string
): [string, number][] => {
  if (arr.length === 0) {
    arr.push([lyric, 1]);
    return arr;
  }

  for (const lyricData of arr) {
    if (lyricData[0] === lyric) {
      lyricData[1] += 1;
      return arr;
    }
  }

  arr.push([lyric, 1]);
  return arr;
};

const sortLyricsByOccurances = (
  lyrics: [string, number][]
): [string, number][] => {
  // var that stores sorted values of regular descendin
  const topLyrics = lyrics.sort(function (a, b) {
    if (a[1] > b[1]) return -1;
    if (a[1] < b[1]) return 1;
    return 0;
  });

  return topLyrics;
};

const getOccurancesPerLyric = (lyrics: string): [string, number][] => {
  let talliedLyrics: [string, number][] = [];

  const lyricsArr = lyrics.split(" ");

  for (const lyric of lyricsArr) {
    talliedLyrics = appendLyricToArray(talliedLyrics, lyric);
  }

  return talliedLyrics;
};

const recalculateAndUpdateGlobalCollection = (
  updatedTotalUserLyrics: [string, number][],
  newLyrics: [string, number][],
  currentUsername: string
) => {
  updatedTotalUserLyrics = newLyrics;

  UserLyrics.find({})
    .exec()
    .then((response) => {
      if (response.length > 0) {
        for (const user of response) {
          if (user.spotifyUsername !== currentUsername) {
            for (const lyric of updatedTotalUserLyrics) {
              updatedTotalUserLyrics = appendLyricToArray(
                updatedTotalUserLyrics,
                lyric[0]
              );
            }
          }
        }

        // const newGlobalDoc = new GlobalLyrics(
        //   {
        //     sortedLyrics: updatedTotalUserLyrics,
        //   },
        //   "global"
        // );

        GlobalLyrics.findOneAndUpdate(
          {}, // this theoretically will target everything aka the only doc in there
          {
            sortedLyrics: updatedTotalUserLyrics,
          },
          { upsert: true },
          function (err, doc) {
            if (err) console.log("failed", err);
            else console.log("global doc", doc);
          }
        );
      }
    });
};

export const getLyrics = async (req: Request, res: Response) => {
  const currentUsername = req.body.currentUsername;
  const songs = req.body.userSongList;

  const promises = [];

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

    // const newUserDoc = new UserLyrics(
    //   {
    //     spotifyUsername: currentUsername,
    //     sortedLyrics: finalUserResult,
    //   },
    //   "users"
    // );

    UserLyrics.findOneAndUpdate(
      { spotifyUsername: currentUsername },
      { sortedLyrics: finalUserResult },
      { upsert: true }, // hopefully adds properly
      function (err, doc) {
        // if user doesn't exist yet, add them to collection
        if (err) {
          console.log("error was:", err);
        } else console.log("user doc", doc);
      }
    );

    recalculateAndUpdateGlobalCollection(
      finalGlobalResult,
      finalUserResult,
      currentUsername
    );

    res.json({ user: finalUserResult, global: finalGlobalResult });
  });
};
