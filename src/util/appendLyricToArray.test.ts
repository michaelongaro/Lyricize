import appendLyricToArray from "./appendLyricToArray";

test("initializes empty array with first lyric", () => {
  expect(appendLyricToArray([], "Sparse")).toStrictEqual([["Sparse", 1]]);
});

test("initializes empty array with first lyric (with occurrences)", () => {
  expect(appendLyricToArray([], "Sparse", 35)).toStrictEqual([["Sparse", 35]]);
});

test("adds a new occurrence of lyric ", () => {
  expect(appendLyricToArray([], "Spare")).toStrictEqual([["Spare", 1]]);
});

test("increments count of present lyric", () => {
  expect(appendLyricToArray([["Spare", 1]], "Spare")).toStrictEqual([
    ["Spare", 2],
  ]);
});

test("increments count of present lyric by specified value", () => {
  expect(appendLyricToArray([["Spare", 2]], "Spare", 5)).toStrictEqual([
    ["Spare", 7],
  ]);
});
