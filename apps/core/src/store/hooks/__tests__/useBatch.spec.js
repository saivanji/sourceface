import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { renderHook, act } from "@testing-library/react-hooks";
import useBatch from "../useBatch";
import { ModuleProvider } from "../../providers";
import * as slices from "../../slices";

const type = slices.atoms.actions.updateMany.type;
const mockStore = configureStore([]);

it("should return a function dispatching update action, where func argument is object", () => {
  const moduleId = 4;
  const fragment = { foo: 4, bar: 1, baz: 7 };

  const { store, result } = render(moduleId);

  act(() => {
    result.current(fragment);
  });

  expect(store.getActions()).toContainEqual({
    type,
    payload: {
      moduleId,
      fragment,
    },
  });
});

it("should return a function dispatching update action, where func argument is updater", () => {
  const moduleId = 2;
  const prev = {
    foo: 6,
    bar: 9,
    baz: 3,
  };
  const next = (prev) => ({
    foo: prev.foo + 1,
    bar: prev.bar + 1,
    baz: prev.baz + 1,
  });

  const { store, result } = render(moduleId, prev);

  act(() => {
    result.current(next);
  });

  expect(store.getActions()).toContainEqual({
    type,
    payload: {
      moduleId,
      fragment: {
        foo: 7,
        bar: 10,
        baz: 4,
      },
    },
  });
});

it("should return referentially equal function as a result", () => {
  const { result, rerender } = render();

  const first = result.current;
  rerender();
  const second = result.current;

  expect(first).toBe(second);
});

function render(moduleId, prev) {
  const store = mockStore({
    atoms: {
      [moduleId]: prev,
    },
  });
  const Wrapper = ({ children }) => (
    <Provider store={store}>
      <ModuleProvider moduleId={moduleId}>{children}</ModuleProvider>
    </Provider>
  );

  const { result, rerender } = renderHook(() => useBatch(), {
    wrapper: Wrapper,
  });

  return { result, rerender, store };
}
