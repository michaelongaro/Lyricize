import { Request, Response } from "express";

import Genius from "genius-lyrics";

import { UserLyrics, GlobalLyrics } from "../models/lyrics.js";

const Client = new Genius.Client(
  "DdPIOZy9Ks-7AkpKq-Pxn6WpPQ6rmEcgM6_EFCAK_pAX5wMxovOuDkm8PMcB_kAFK3cbEgtYoRWNOSSV5rtlGw"
);

const sanitizeLyrics = (lyrics: string): string => {
  const chorusMatch = /\[[^\]]*\]/gm;
  const punctuationMatch = /[.,()!{}|?;:"]/gm;

  lyrics = lyrics.replaceAll("\n", " ");
  lyrics = lyrics.replaceAll(chorusMatch, " ");
  lyrics = lyrics.replaceAll(punctuationMatch, " ");

  lyrics = lyrics.trim().replaceAll(/\s+/g, " "); // turns all spaces (of any length) into just one space

  lyrics = lyrics
    .split(" ")
    .map((word) => {
      if (word) {
        return word[0].toUpperCase() + word.substring(1).toLowerCase();
      }
    })
    .join(" ");

  return lyrics;
};

const appendLyricToArray = (
  arr: [string, number][],
  lyric: string,
  occurances?: number
): [string, number][] => {
  if (arr.length === 0 && !occurances) {
    arr.push([lyric, 1]);
    return arr;
  }

  // could just be .contains(lyric) -> .indexOf(lyric)...
  for (const lyricData of arr) {
    if (lyricData[0] === lyric) {
      lyricData[1] += occurances ?? 1;
      return arr;
    }
  }

  if (occurances) {
    arr.push([lyric, occurances]);
  } else {
    arr.push([lyric, 1]);
  }

  return arr;
};

const sortLyricsByOccurances = (
  lyrics: [string, number][]
): [string, number][] => {
  const lyricsByDescendingOccurances = lyrics.sort(function (a, b) {
    if (a[1] > b[1]) return -1;
    if (a[1] < b[1]) return 1;
    return 0;
  });

  return lyricsByDescendingOccurances;
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
  updatedTotalUserLyrics: [string, number][]
  // newLyrics: [string, number][],
  // currentUsername: string
) => {
  // updatedTotalUserLyrics = newLyrics;

  // @ts-ignore
  let cominedLyricCount = [];

  UserLyrics.find({})
    .exec()
    .then((response) => {
      if (response.length > 0) {
        for (const user of response) {
          console.log("user", user);
          cominedLyricCount.push(user.sortedLyrics);
        }

        // @ts-ignore
        for (const lyric of cominedLyricCount.flat()) {
          console.log("lyricpair:", updatedTotalUserLyrics.length);

          updatedTotalUserLyrics = appendLyricToArray(
            updatedTotalUserLyrics,
            // @ts-ignore
            lyric[0],
            // @ts-ignore
            lyric[1]
          );
        }
        // console.log(updatedTotalUserLyrics);

        GlobalLyrics.findOneAndUpdate(
          {},
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
      { upsert: true },
      function (err, doc) {
        if (err) {
          console.log("error was:", err);
        } else {
          recalculateAndUpdateGlobalCollection(
            finalGlobalResult
            // finalUserResult,
            // currentUsername
          );
        }
      }
    );

    res.json({ user: finalUserResult, global: finalGlobalResult });
  });
};
