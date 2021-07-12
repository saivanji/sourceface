import { init } from "../fakes";

it("should return module by it's id", () => {
  const { fakes, createStore } = init();

  fakes.stock.addDefinition("text");
  fakes.entities.addModule("text");
  fakes.entities.addModule("text");
  fakes.entities.addModule("text");
  fakes.entities.addModule("text");

  const callback = jest.fn();
  const store = createStore();
  store.data.modules().subscribe(callback);

  expect(callback).toBeCalledWith(["1", "2", "3", "4"]);
});
