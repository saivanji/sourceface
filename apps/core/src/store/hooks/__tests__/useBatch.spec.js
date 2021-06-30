import React from "react";
import { Provider } from "react-redux";
import { keys } from "ramda";
import configureStore from "redux-mock-store";
import { renderHook, act } from "@testing-library/react-hooks";
import useBatch from "../useBatch";

const type = "SOME_TYPE";
const mockStore = configureStore([]);

it("should return a function dispatching action created from setters result, where func argument is object", () => {
  const next = { foo: 4, bar: 1, baz: 7 };
  const { actions } = prepare(next);

  expect(actions).toContainEqual({
    type,
    payload: next,
  });
});

it("should return a function dispatching action created from setters result, where func argument is updater", () => {
  const next = (prev) => ({
    foo: prev.foo + 1,
    bar: prev.bar + 1,
    baz: prev.baz + 1,
  });
  const { actions } = prepare(next);

  expect(actions).toContainEqual({
    type,
    payload: {
      foo: 7,
      bar: 10,
      baz: 4,
    },
  });
});

it("should ignore extra fields provided as object argument", () => {
  const next = { foo: 4, bar: 1, baz: 7 };
  const { actions } = prepare({ ...next, extra: 2 });

  expect(actions).toContainEqual({
    type,
    payload: next,
  });
});

it("should ignore extra fields provided as a result of function argument", () => {
  const next = (prev) => ({
    foo: prev.foo + 1,
    bar: prev.bar + 1,
    baz: prev.baz + 1,
    extra: 5,
  });
  const { actions } = prepare(next);

  expect(actions).toContainEqual({
    type,
    payload: {
      foo: 7,
      bar: 10,
      baz: 4,
    },
  });
});

it("should keep the structure of the supplied data when fewer fields are provided as object argument", () => {
  const next = { foo: 4, bar: 1 };
  const { actions } = prepare(next);

  expect(actions).toContainEqual({
    type,
    payload: next,
  });
});

it("should keep the structure of the supplied data when fewer fields are provided as function argument result", () => {
  const next = (prev) => ({
    foo: prev.foo + 1,
    bar: prev.bar + 1,
  });
  const { actions } = prepare(next);

  expect(actions).toContainEqual({
    type,
    payload: {
      foo: 7,
      bar: 10,
    },
  });
});

it("should supply 'true' as a second argument to every setter function", () => {
  const setter1 = jest.fn(() => ({
    actionType: type,
    key: "foo",
    value: 1,
  }));
  const setter2 = jest.fn(() => ({
    actionType: type,
    key: "bar",
    value: 2,
  }));

  prepare({ foo: 2, bar: 3 }, [setter1, setter2]);

  expect(setter1).toBeCalledWith(undefined, true);
  expect(setter2).toBeCalledWith(undefined, true);
});

it("should return referentially equal function as a result", () => {
  const { result, rerender } = renderHookWithStore(() => useBatch());

  const first = result.current;

  rerender();

  expect(first).toBe(result.current);
});

it("should throw when setters resulting in different action types", () => {
  const setter1 = jest.fn(() => ({
    actionType: type,
    key: "foo",
    value: 1,
  }));
  const setter2 = jest.fn(() => ({
    actionType: "OTHER_TYPE",
    key: "bar",
    value: 2,
  }));

  expect(() => prepare({}, [setter1, setter2])).toThrowError(
    /Setter functions should have the same action types/
  );
});

function renderHookWithStore(callback) {
  const store = mockStore({});
  const Wrapper = ({ children }) => (
    <Provider store={store}>{children}</Provider>
  );

  const { result, rerender } = renderHook(callback, {
    wrapper: Wrapper,
  });

  return { result, rerender, store };
}

function prepare(next, initialSetters) {
  const data = {
    foo: 6,
    bar: 9,
    baz: 3,
  };

  const setters =
    initialSetters ||
    keys(data).map((key) => () => {
      return {
        actionType: type,
        key,
        value: data[key],
      };
    });

  const { result, store } = renderHookWithStore(() => useBatch(...setters));

  act(() => {
    result.current(next);
  });

  return {
    actions: store.getActions(),
    result,
  };
}
