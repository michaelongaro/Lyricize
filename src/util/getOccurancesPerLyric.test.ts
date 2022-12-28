import getOccurancesPerLyric from "./getOccurancesPerLyric";

test("returns array of type [string, number] with the correct lyrics", () => {
  expect(getOccurancesPerLyric("First Second Third")).toStrictEqual([
    ["First", 1],
    ["Second", 1],
    ["Third", 1],
  ]);
});
