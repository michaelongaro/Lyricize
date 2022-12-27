import sortLyricsByOccurances from "./sortLyricsByOccurances";

test("when given an empty input array, return value is the same as the input", () => {
  expect(sortLyricsByOccurances([])).toStrictEqual([]);
});

test("when given a lesser occurance, followed by a larger occurance, return value is greater, lesser", () => {
  expect(
    sortLyricsByOccurances([
      ["Spike", 4],
      ["Play", 15],
    ])
  ).toStrictEqual([
    ["Play", 15],
    ["Spike", 4],
  ]);
});

test("when given a larger occurance, followed by a lesser occurance, return value is: greater, lesser", () => {
  expect(
    sortLyricsByOccurances([
      ["Play", 15],
      ["Spike", 4],
    ])
  ).toStrictEqual([
    ["Play", 15],
    ["Spike", 4],
  ]);
});

// input arrays which all have the same occurance values have no need to be sorted.
