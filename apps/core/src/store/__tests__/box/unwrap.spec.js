import Box from "../../box";

it("should unwrap sync data", () => {
  const box = new Box(5);

  expect(box.unwrap()).toEqual(5);
});

it("should unwrap async data", () => {
  const box = new Box(Promise.resolve(5));

  return expect(box.unwrap()).resolves.toEqual(5);
});
