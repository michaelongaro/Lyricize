import sanitizeLyrics from "./sanitizeLyrics";

test("sanitizeLyrics should remove newlines, punctuation, and square brackets", () => {
  const lyrics = `[Intro]
  This is some lyrics
  With a chorus: [Chorus]
  And some punctuation!`;
  const expected = "This Is Some Lyrics With A Chorus And Some Punctuation";
  const result = sanitizeLyrics(lyrics);
  expect(result).toEqual(expected);
});

test("sanitizeLyrics should capitalize the first letter of each word", () => {
  const lyrics = "this is some lowercase lyrics";
  const expected = "This Is Some Lowercase Lyrics";
  const result = sanitizeLyrics(lyrics);
  expect(result).toEqual(expected);
});

test("sanitizeLyrics should remove excess white space", () => {
  const lyrics =
    "  this   is   some    lyrics   with    excess white   space   ";
  const expected = "This Is Some Lyrics With Excess White Space";
  const result = sanitizeLyrics(lyrics);
  expect(result).toEqual(expected);
});
