const sortLyricsByOccurances = (
  lyrics: [string, number][]
): [string, number][] => {
  return lyrics.sort((a, b) => {
    if (a[1] > b[1]) return -1;
    if (a[1] < b[1]) return 1;
    return 0;
  });
};

export default sortLyricsByOccurances;
