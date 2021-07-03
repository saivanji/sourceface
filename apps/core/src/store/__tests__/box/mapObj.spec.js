import Box from "../../box";

it("should map the object where result of applied function is Box with sync data", () => {
  const items = {
    x: "a",
    y: "b",
    z: "c",
  };
  const result = Box.mapObj((x) => new Box(x + x), items).unwrap();

  expect(result).toEqual({
    x: "aa",
    y: "bb",
    z: "cc",
  });
});

it("should map the object where result of applied function is Box with async data", () => {
  const items = {
    x: "a",
    y: "b",
    z: "c",
  };
  const result = Box.mapObj(
    (x) => new Box(Promise.resolve(x + x)),
    items
  ).unwrap();

  return expect(result).resolves.toEqual({
    x: "aa",
    y: "bb",
    z: "cc",
  });
});
