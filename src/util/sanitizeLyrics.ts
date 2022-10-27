const sanitizeLyrics = (lyrics: string): string => {
  const chorusMatch = /\[[^\]]*\]/gm;
  const punctuationMatch = /[.,()!{}|?;:"]/gm;

  lyrics = lyrics.replaceAll("\n", " ");
  lyrics = lyrics.replaceAll(chorusMatch, " ");
  lyrics = lyrics.replaceAll(punctuationMatch, " ");

  // turns all spaces (of any length) into just one space
  lyrics = lyrics.trim().replaceAll(/\s+/g, " ");

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

export default sanitizeLyrics;
