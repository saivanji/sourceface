import { keys } from "ramda";
import useBatch from "../useBatch";

it("should return a function dispatching action created from setters result, where func argument is object", () => {
  const { batch, mockDispatch } = prepare();
  const next = { foo: 4, bar: 1, baz: 7 };

  batch(next);

  expect(mockDispatch).toBeCalledWith({
    type: "SOME_TYPE",
    payload: next,
  });
});

it("should return a function dispatching action created from setters result, where func argument is updater", () => {
  const { batch, mockDispatch } = prepare();
  const next = (prev) => ({
    foo: prev.foo + 1,
    bar: prev.bar + 1,
    baz: prev.baz + 1,
  });

  batch(next);

  expect(mockDispatch).toBeCalledWith({
    type: "SOME_TYPE",
    payload: {
      foo: 7,
      bar: 10,
      baz: 4,
    },
  });
});

it("should ignore extra fields provided as object argument", () => {
  const { batch, mockDispatch } = prepare();
  const next = { foo: 4, bar: 1, baz: 7 };

  batch({ ...next, extra: 2 });

  expect(mockDispatch).toBeCalledWith({
    type: "SOME_TYPE",
    payload: next,
  });
});

it("should ignore extra fields provided as a result of function argument", () => {
  const { batch, mockDispatch } = prepare();
  const next = (prev) => ({
    foo: prev.foo + 1,
    bar: prev.bar + 1,
    baz: prev.baz + 1,
    extra: 5,
  });

  batch(next);

  expect(mockDispatch).toBeCalledWith({
    type: "SOME_TYPE",
    payload: {
      foo: 7,
      bar: 10,
      baz: 4,
    },
  });
});

it("should keep the structure of the supplied data when fewer fields are provided as object argument", () => {
  const { batch, mockDispatch } = prepare();
  const next = { foo: 4, bar: 1 };

  batch(next);

  expect(mockDispatch).toBeCalledWith({
    type: "SOME_TYPE",
    payload: next,
  });
});

it("should keep the structure of the supplied data when fewer fields are provided as function argument result", () => {
  const { batch, mockDispatch } = prepare();
  const next = (prev) => ({
    foo: prev.foo + 1,
    bar: prev.bar + 1,
  });

  batch(next);

  expect(mockDispatch).toBeCalledWith({
    type: "SOME_TYPE",
    payload: {
      foo: 7,
      bar: 10,
    },
  });
});

it("should supply 'true' as a second argument to every setter function", () => {
  const setter1 = jest.fn(() => ({
    actionType: "SOME_TYPE",
    key: "foo",
    value: 1,
  }));
  const setter2 = jest.fn(() => ({
    actionType: "SOME_TYPE",
    key: "bar",
    value: 2,
  }));

  const { batch } = prepare([setter1, setter2]);
  batch({ foo: 2, bar: 3 });

  expect(setter1).toBeCalledWith(undefined, true);
  expect(setter2).toBeCalledWith(undefined, true);
});

function prepare(initialSetters) {
  const data = {
    foo: 6,
    bar: 9,
    baz: 3,
  };

  const setters =
    initialSetters ||
    keys(data).map((key) => () => {
      return {
        actionType: "SOME_TYPE",
        key,
        value: data[key],
      };
    });

  const mockDispatch = jest.fn();
  jest
    .spyOn(require("react-redux"), "useDispatch")
    .mockImplementation(() => mockDispatch);

  //eslint-disable-next-line
  const batch = useBatch(...setters);

  return {
    batch,
    mockDispatch,
  };
}
