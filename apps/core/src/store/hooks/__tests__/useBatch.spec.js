import React from "react";
import { Provider } from "react-redux";
import { keys } from "ramda";
import configureStore from "redux-mock-store";
import { renderHook, act } from "@testing-library/react-hooks";
import useBatch from "../useBatch";

const type = "SOME_TYPE";
const mockStore = configureStore([]);

it("should return a function dispatching action created from setters result, where func argument is object", () => {
  const { store, result } = prepare();
  const next = { foo: 4, bar: 1, baz: 7 };

  act(() => {
    result.current(next);
  });

  expect(store.getActions()).toContainEqual({
    type,
    payload: next,
  });
});

it("should return a function dispatching action created from setters result, where func argument is updater", () => {
  const { store, result } = prepare();
  const next = (prev) => ({
    foo: prev.foo + 1,
    bar: prev.bar + 1,
    baz: prev.baz + 1,
  });

  act(() => {
    result.current(next);
  });

  expect(store.getActions()).toContainEqual({
    type,
    payload: {
      foo: 7,
      bar: 10,
      baz: 4,
    },
  });
});

it("should ignore extra fields provided as object argument", () => {
  const { store, result } = prepare();
  const next = { foo: 4, bar: 1, baz: 7 };

  act(() => {
    result.current({ ...next, extra: 2 });
  });

  expect(store.getActions()).toContainEqual({
    type,
    payload: next,
  });
});

it("should ignore extra fields provided as a result of function argument", () => {
  const { store, result } = prepare();
  const next = (prev) => ({
    foo: prev.foo + 1,
    bar: prev.bar + 1,
    baz: prev.baz + 1,
    extra: 5,
  });

  act(() => {
    result.current(next);
  });

  expect(store.getActions()).toContainEqual({
    type,
    payload: {
      foo: 7,
      bar: 10,
      baz: 4,
    },
  });
});

it("should keep the structure of the supplied data when fewer fields are provided as object argument", () => {
  const { store, result } = prepare();
  const next = { foo: 4, bar: 1 };

  act(() => {
    result.current(next);
  });

  expect(store.getActions()).toContainEqual({
    type,
    payload: next,
  });
});

it("should keep the structure of the supplied data when fewer fields are provided as function argument result", () => {
  const { store, result } = prepare();
  const next = (prev) => ({
    foo: prev.foo + 1,
    bar: prev.bar + 1,
  });

  act(() => {
    result.current(next);
  });

  expect(store.getActions()).toContainEqual({
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

  const { result } = prepare([setter1, setter2]);

  act(() => {
    result.current({ foo: 2, bar: 3 });
  });

  expect(setter1).toBeCalledWith(undefined, true);
  expect(setter2).toBeCalledWith(undefined, true);
});

it("should return referentially equal function as a result", () => {
  const { result, rerender } = prepare();

  const first = result.current;
  rerender();
  const second = result.current;

  expect(first).toBe(second);
});

it("should consider recent previous data to be returned from setter on every render", () => {
  let value = 7;

  const setter = () => ({
    actionType: type,
    key: "foo",
    value,
  });

  const { store, result, rerender } = prepare([setter]);

  value = 20;
  rerender();

  act(() => {
    result.current((prev) => ({ foo: prev.foo + 1 }));
  });

  expect(store.getActions()).toContainEqual({
    type,
    payload: {
      foo: 21,
    },
  });
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

  const { result } = prepare([setter1, setter2]);

  expect(() => act(() => result.current({}))).toThrowError(
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
        actionType: type,
        key,
        value: data[key],
      };
    });

  const { result, store, rerender } = renderHookWithStore(() =>
    useBatch(...setters)
  );

  return {
    store,
    result,
    rerender,
  };
}
