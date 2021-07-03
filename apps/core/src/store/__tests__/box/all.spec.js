import Box from "../../box";

it("should resolve the list of Box items where Boxes have sync data", () => {
  const items = [new Box("a"), new Box("b"), new Box("c")];
  const result = Box.all(items).unwrap();

  expect(result).toEqual(["a", "b", "c"]);
});

it("should resolve the list of Box items where Boxes have async data", () => {
  const items = [
    new Box(Promise.resolve("a")),
    new Box(Promise.resolve("b")),
    new Box(Promise.resolve("c")),
  ];
  const result = Box.all(items).unwrap();

  return expect(result).resolves.toEqual(["a", "b", "c"]);
});
