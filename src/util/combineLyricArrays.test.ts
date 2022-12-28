import combineLyricArrays from "./combineLyricArrays";

test("adds newArr values to empty baseArr", () => {
  expect(
    combineLyricArrays(
      [],
      [
        ["Dime", 2],
        ["Throw", 15],
      ]
    )
  ).toStrictEqual([
    ["Dime", 2],
    ["Throw", 15],
  ]);
});

test("combines similar lyrics with sum of both occurances", () => {
  expect(
    combineLyricArrays(
      [
        ["Dime", 2],
        ["Throw", 15],
      ],
      [
        ["Dime", 7],
        ["Penny", 4],
      ]
    )
  ).toStrictEqual([
    ["Dime", 9],
    ["Throw", 15],
    ["Penny", 4],
  ]);
});
