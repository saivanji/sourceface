import Box from "../../box";

it("should pipe over sync data", () => {
  const box = new Box(4).pipe((x) => x + 1);

  expect(box.unwrap()).toBe(5);
});

it("should pipe over sync data where Box with sync data is returned", () => {
  const box = new Box(4).pipe((x) => new Box(x + 1));

  expect(box.unwrap()).toBe(5);
});

it("should pipe over sync data where Box with async data is returned", () => {
  const box = new Box(4).pipe((x) => new Box(Promise.resolve(x + 1)));

  return expect(box.unwrap()).resolves.toBe(5);
});

it("should pipe over async data", () => {
  const box = new Box(Promise.resolve(4)).pipe((x) => x + 1);

  return expect(box.unwrap()).resolves.toBe(5);
});

it("should pipe over async data where Box is returned", () => {
  const box = new Box(Promise.resolve(4)).pipe((x) => new Box(x + 1));

  return expect(box.unwrap()).resolves.toBe(5);
});

it("should pipe over async data where Box with async data is returned", () => {
  const box = new Box(Promise.resolve(4)).pipe(
    (x) => new Box(Promise.resolve(x + 1))
  );

  return expect(box.unwrap()).resolves.toBe(5);
});
