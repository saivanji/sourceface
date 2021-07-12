import { init } from "../fakes";

it("should return available module ids", () => {
  const { fakes, createStore } = init();

  fakes.stock.addDefinition("text");
  const { id, ...module } = fakes.entities.addModule("text");

  const callback = jest.fn();
  const store = createStore();
  store.data.module(id).subscribe(callback);

  expect(callback).toBeCalledWith(module);
});
