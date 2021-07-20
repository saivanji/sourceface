import { init, toSync } from "../fakes";

it("should return module data", () => {
  const { fakes, createStore } = init();

  fakes.stock.addDefinition("text");
  const { id, ...module } = fakes.entities.addModule("text");

  const store = createStore();
  const result = toSync(store.data.module(id));

  expect(result).toEqual(module);
});
