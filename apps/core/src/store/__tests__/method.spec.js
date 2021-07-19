import { init } from "../fakes";

it("should create module method without dependencies", () => {
  const { fakes, createStore } = init();

  fakes.stock.addDefinition("input").addMethod("reveal", () => "foo");
  const module = fakes.entities.addModule("input");

  const callback = jest.fn();
  const store = createStore();

  const method = store.actions.method(module.id, "reveal");
  method().subscribe(callback);
  expect(callback).toBeCalledWith("foo");
});

it("should create module method when Promise is returned from definition", (done) => {
  const { fakes, createStore } = init();

  fakes.stock
    .addDefinition("input")
    .addMethod("reveal", () => Promise.resolve("foo"));
  const module = fakes.entities.addModule("input");

  const store = createStore();

  const method = store.actions.method(module.id, "reveal");
  method().subscribe((data) => {
    expect(data).toBe("foo");
    done();
  });
});

it("should create module method when args provided", () => {
  const { fakes, createStore } = init();

  fakes.stock.addDefinition("input").addMethod("reveal", (args) => args.x + 5);
  const module = fakes.entities.addModule("input");

  const callback = jest.fn();
  const store = createStore();

  const method = store.actions.method(module.id, "reveal");
  method({ x: 4 }).subscribe(callback);
  expect(callback).toBeCalledWith(9);
});

it("should create module method with setting dependency", () => {
  const { fakes, createStore } = init();

  fakes.stock
    .addDefinition("input")
    .addMethod("reveal", (_args, { settings: [initial] }) => "foo" + initial, {
      settings: ["initial"],
    });

  const value = fakes.entities.addConstantVariable("bar");
  const stage = fakes.entities.addValueStage(value.id);
  const module = fakes.entities.addModule("input", {
    fields: { initial: [stage.id] },
  });

  const callback = jest.fn();
  const store = createStore();

  const method = store.actions.method(module.id, "reveal");
  method().subscribe(callback);
  expect(callback).toBeCalledWith("foobar");
});

it("should create module method with attribute dependency", () => {
  const { fakes, createStore } = init();

  fakes.stock
    .addDefinition("input")
    .addAttribute("value", () => "bar")
    .addMethod("reveal", (_args, { attributes: [value] }) => "foo" + value, {
      attributes: ["value"],
    });

  const module = fakes.entities.addModule("input");

  const callback = jest.fn();
  const store = createStore();

  const method = store.actions.method(module.id, "reveal");
  method().subscribe(callback);
  expect(callback).toBeCalledWith("foobar");
});

it("should create module method with atom dependency", () => {
  const { fakes, createStore } = init();

  fakes.stock
    .addDefinition("input")
    .addMethod("reveal", (_args, { atoms: [current] }) => "foo" + current, {
      atoms: ["current"],
    })
    .addInitialAtoms({ current: "bar" });
  const module = fakes.entities.addModule("input");

  const callback = jest.fn();
  const store = createStore();

  const method = store.actions.method(module.id, "reveal");
  method().subscribe(callback);
  expect(callback).toBeCalledWith("foobar");
});

it("should update atoms inside of method selector", () => {
  const { fakes, createStore } = init();

  fakes.stock
    .addDefinition("input")
    .addMethod("reveal", (_args, { updateAtoms }) => {
      updateAtoms({ revealed: true });
    })
    .addInitialAtoms({ revealed: false });
  const module = fakes.entities.addModule("input");

  const callback = jest.fn();
  const store = createStore();

  const method = store.actions.method(module.id, "reveal");
  method().subscribe(jest.fn);

  store.data.atom(module.id, "revealed").subscribe(callback);
  expect(callback).toBeCalledWith(true);
});
