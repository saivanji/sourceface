import { init } from "../fakes";

it("should update multiple atom values", () => {
  const { fakes, createStore } = init();

  fakes.stock
    .addDefinition("input")
    .addInitialAtoms({ current: "foo", touched: false });
  const module = fakes.entities.addModule("input");

  const store = createStore();
  store.actions.updateAtoms(module.id, { current: "bar", touched: true });

  const callback1 = jest.fn();
  store.data.atom(module.id, "current").subscribe(callback1);
  expect(callback1).toBeCalledWith("bar");

  const callback2 = jest.fn();
  store.data.atom(module.id, "touched").subscribe(callback2);
  expect(callback2).toBeCalledWith(true);
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

  const callback1 = jest.fn();
  store.data.atom(module.id, "current").subscribe(callback1);
  expect(callback1).toBeCalledWith("foobar");

  const callback2 = jest.fn();
  store.data.atom(module.id, "touched").subscribe(callback2);
  expect(callback2).toBeCalledWith(true);
});
