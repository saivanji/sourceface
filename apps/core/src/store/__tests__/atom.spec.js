import { init, toSync } from "../fakes";

it("should return atom value", () => {
  const { fakes, createStore } = init();

  fakes.stock.addDefinition("input").addInitialAtoms({ current: "foo" });
  const module = fakes.entities.addModule("input");

  const store = createStore();

  const result = toSync(store.data.atom(module.id, "current"));
  expect(result).toBe("foo");
});
