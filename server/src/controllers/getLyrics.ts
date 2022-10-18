import { Request, Response } from "express";

import { UserLyrics } from "../models/lyrics.js";

import Genius from "genius-lyrics";
const Client = new Genius.Client();

const sanitizeLyrics = (lyrics: string): string => {
  lyrics = lyrics.slice(0, 1).toUpperCase() + lyrics.slice(1).toLowerCase();

  const firstRegex = /\[[^\]]*\]/gm;
  const secondRegex = /[.,()!?;:"]/gm;

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

export const getLyrics = async (req: Request, res: Response) => {
  const currentUsername = req.body.currentUsername;
  const songs = req.body.songs;

  console.log("username:", currentUsername);

  const lyrics: any = []; // narrow later
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

    const newUserDoc = new UserLyrics(
      {
        spotifyUsername: currentUsername,
        sortedLyrics: finalUserResult,
      },
      "users"
    );
    newUserDoc.save();

    // check if user exists in global collection already

    UserLyrics.findOneAndUpdate(
      { spotifyUsername: currentUsername },
      newUserDoc, // finalUserResult
      { upsert: true },
      function (err, doc) {
        if (err) console.log("error", err);
        else console.log("doc", doc);
        // return res.send("Succesfully saved.");
      }
    );

    // i think will need to loop over global values and put into var that mimics [[string, number]]

    // GlobalLyrics.find({ spotifyUsername: currentUsername })
    //   .exec()
    //   .then((response) => {
    //     console.log(response);

    //     // update if already there
    //     if (response.length > 0) {
    //       res.json(response[0][usersArr]["sortedLyrics"]);
    //     }
    //     // otherwise add user data to existing arr
    //     else {
    //     }
    //   });

    res.json(finalUserResult);
  });
};
