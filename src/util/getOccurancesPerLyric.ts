import appendLyricToArray from "./appendLyricToArray.js";

const getOccurancesPerLyric = (lyrics: string): [string, number][] => {
  let talliedLyrics: [string, number][] = [];

  for (const lyric of lyrics.split(" ")) {
    talliedLyrics = appendLyricToArray(talliedLyrics, lyric);
  }

  return talliedLyrics;
};

export default getOccurancesPerLyric;
