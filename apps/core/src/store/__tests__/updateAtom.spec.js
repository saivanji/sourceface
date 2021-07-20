import { init, toSync } from "../fakes";

it("should update atom value", () => {
  const { fakes, createStore } = init();

  fakes.stock.addDefinition("input").addInitialAtoms({ current: "foo" });
  const module = fakes.entities.addModule("input");

  const store = createStore();
  store.actions.updateAtom(module.id, "current", "bar");

  const result = toSync(store.data.atom(module.id, "current"));
  expect(result).toBe("bar");
});

it("should update atom value by providing a function", () => {
  const { fakes, createStore } = init();

  fakes.stock.addDefinition("input").addInitialAtoms({ current: "foo" });
  const module = fakes.entities.addModule("input");

  const store = createStore();
  store.actions.updateAtom(module.id, "current", (prev) => prev + "bar");

  const result = toSync(store.data.atom(module.id, "current"));
  expect(result).toBe("foobar");
});
