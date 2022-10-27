const appendLyricToArray = (
  arr: [string, number][],
  lyric: string,
  occurances?: number
): [string, number][] => {
  if (arr.length === 0 && !occurances) {
    arr.push([lyric, 1]);
    return arr;
  }

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

export default appendLyricToArray;
