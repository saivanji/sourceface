import { init } from "../fakes";

it("should return atom value", () => {
  const { fakes, createStore } = init();

  fakes.stock.addDefinition("input").addInitialAtoms({ current: "foo" });
  const module = fakes.entities.addModule("input");

  const callback = jest.fn();
  const store = createStore();
  store.data.atom(module.id, "current").subscribe(callback);

  expect(callback).toBeCalledWith("foo");
});
