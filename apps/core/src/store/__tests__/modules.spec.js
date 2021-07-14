import { init } from "../fakes";

it("should return top level modules", () => {
  const { fakes, createStore } = init();

  fakes.stock.addDefinition("text");
  const one = fakes.entities.addModule("text");
  const two = fakes.entities.addModule("text");
  const three = fakes.entities.addModule("text");
  const four = fakes.entities.addModule("text");

  const callback = jest.fn();
  const store = createStore();
  store.data.modules().subscribe(callback);

  expect(callback).toBeCalledWith([one.id, two.id, three.id, four.id]);
});

it("should return modules of parent", () => {
  const { fakes, createStore } = init();

  fakes.stock.addDefinition("text");
  fakes.stock.addDefinition("container");

  const container = fakes.entities.addModule("container");
  fakes.entities.addModule("text");
  fakes.entities.addModule("text");

  const one = fakes.entities.addModule("text", { parentId: container.id });
  const two = fakes.entities.addModule("text", { parentId: container.id });
  const three = fakes.entities.addModule("text", { parentId: container.id });

  const callback = jest.fn();
  const store = createStore();
  store.data.modules(container.id).subscribe(callback);

  expect(callback).toBeCalledWith([one.id, two.id, three.id]);
});
