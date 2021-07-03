import Box from "../../box";

it("should reduce the list of items where result of applied function is Box with sync data", () => {
  const items = ["a", "b", "c"];
  const result = Box.reduce((acc, x) => new Box(acc + x), "", items).unwrap();

  expect(result).toEqual("abc");
});

it("should reduce the list of items where result of applied function is Box with async data", () => {
  const items = ["a", "b", "c"];
  const result = Box.reduce(
    (acc, x) => new Box(Promise.resolve(acc + x)),
    "",
    items
  ).unwrap();

  return expect(result).resolves.toEqual("abc");
});
