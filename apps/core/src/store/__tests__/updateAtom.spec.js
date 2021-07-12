import { init } from "../fakes";

it("should update atom value", () => {
  const { fakes, createStore } = init();

  fakes.stock.addDefinition("input").addInitialAtoms({ current: "foo" });
  const module = fakes.entities.addModule("input");

  const store = createStore();
  store.actions.updateAtom(module.id, "current", "bar");

  const callback = jest.fn();
  store.data.atom(module.id, "current").subscribe(callback);
  expect(callback).toBeCalledWith("bar");
});
