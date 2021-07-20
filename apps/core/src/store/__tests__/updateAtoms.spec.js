import { init, toSync } from "../fakes";

it("should update multiple atom values", () => {
  const { fakes, createStore } = init();

  fakes.stock
    .addDefinition("input")
    .addInitialAtoms({ current: "foo", touched: false });
  const module = fakes.entities.addModule("input");

  const store = createStore();
  store.actions.updateAtoms(module.id, { current: "bar", touched: true });

  const result1 = toSync(store.data.atom(module.id, "current"));
  expect(result1).toBe("bar");

  const result2 = toSync(store.data.atom(module.id, "touched"));
  expect(result2).toBe(true);
});

it("should update multiple atom values by providing a function", () => {
  const { fakes, createStore } = init();

  fakes.stock
    .addDefinition("input")
    .addInitialAtoms({ current: "foo", touched: false });
  const module = fakes.entities.addModule("input");

  const store = createStore();
  store.actions.updateAtoms(module.id, (prev) => ({
    current: prev.current + "bar",
    touched: true,
  }));

  const result1 = toSync(store.data.atom(module.id, "current"));
  expect(result1).toBe("foobar");

  const result2 = toSync(store.data.atom(module.id, "touched"));
  expect(result2).toBe(true);
});
