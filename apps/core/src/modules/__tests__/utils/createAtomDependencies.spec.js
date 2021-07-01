import { createAtomDependencies } from "../../utils";

it("should add direct dependent attributes to the dependencies list", () => {
  const attributes = {
    foo: {
      atoms: ["a", "b"],
    },
    bar: {
      atoms: ["a", "c"],
    },
    baz: {
      atoms: ["a", "b", "c"],
    },
  };

  const result = createAtomDependencies(attributes);

  expect(result).toEqual({
    a: ["foo", "bar", "baz"],
    b: ["foo", "baz"],
    c: ["bar", "baz"],
  });
});

it("should add cross dependent attributes to the dependencies list", () => {
  const attributes = {
    x1: {
      atoms: ["a", "b"],
    },
    x2: {
      atoms: ["a", "c"],
    },
    x3: {
      attributes: ["x1"],
    },
    x4: {
      atoms: ["a"],
      attributes: ["x3"],
    },
    x5: {
      atoms: ["c"],
      attributes: ["x4"],
    },
  };

  const result = createAtomDependencies(attributes);

  expect(result).toEqual({
    a: ["x1", "x2", "x3", "x4", "x5"],
    b: ["x1", "x3", "x4", "x5"],
    c: ["x2", "x5"],
  });
});
