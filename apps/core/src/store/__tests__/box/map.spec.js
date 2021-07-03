import Box from "../../box";

it("should map the list of items where result of applied function is Box with sync data", () => {
  const items = ["a", "b", "c"];
  const result = Box.map((x) => new Box(x + x), items).unwrap();

  expect(result).toEqual(["aa", "bb", "cc"]);
});

it("should map the list of items where result of applied function is Box with async data", () => {
  const items = ["a", "b", "c"];
  const result = Box.map(
    (x) => new Box(Promise.resolve(x + x)),
    items
  ).unwrap();

  return expect(result).resolves.toEqual(["aa", "bb", "cc"]);
});
