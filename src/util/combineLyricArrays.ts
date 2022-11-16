import appendLyricToArray from "./appendLyricToArray.js";

const combineLyricArrays = (
  baseArr: [string, number][],
  newArr: [string, number][]
): [string, number][] => {
  for (const lyricData of newArr) {
    baseArr = appendLyricToArray(baseArr, lyricData[0], lyricData[1]);
  }

  return baseArr;
};

export default combineLyricArrays;
