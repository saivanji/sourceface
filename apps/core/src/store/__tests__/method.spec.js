import { init, toSync } from "../fakes";

it("should create module method without dependencies", async () => {
  const { fakes, createStore } = init();

  fakes.stock.addDefinition("input").addMethod("reveal", () => "foo");
  const module = fakes.entities.addModule("input");

  const store = createStore();

  const method = store.actions.method(module.id, "reveal");
  const result = method();
  expect(await result).toBe("foo");
});

it("should create module method when Promise is returned from definition", async () => {
  const { fakes, createStore } = init();

  fakes.stock
    .addDefinition("input")
    .addMethod("reveal", () => Promise.resolve("foo"));
  const module = fakes.entities.addModule("input");

  const store = createStore();

  const method = store.actions.method(module.id, "reveal");
  const result = await method();

  expect(result).toBe("foo");
});

it("should create module method when args provided", async () => {
  const { fakes, createStore } = init();

  fakes.stock.addDefinition("input").addMethod("reveal", (args) => args.x + 5);
  const module = fakes.entities.addModule("input");

  const store = createStore();

  const method = store.actions.method(module.id, "reveal");
  const result = await method({ x: 4 });
  expect(result).toBe(9);
});

it("should create module method with setting dependency", async () => {
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

  const store = createStore();

  const method = store.actions.method(module.id, "reveal");
  const result = await method();
  expect(result).toBe("foobar");
});

it("should create module method with attribute dependency", async () => {
  const { fakes, createStore } = init();

  fakes.stock
    .addDefinition("input")
    .addAttribute("value", () => "bar")
    .addMethod("reveal", (_args, { attributes: [value] }) => "foo" + value, {
      attributes: ["value"],
    });

  const module = fakes.entities.addModule("input");

  const store = createStore();

  const method = store.actions.method(module.id, "reveal");
  const result = await method();
  expect(result).toBe("foobar");
});

it("should create module method with atom dependency", async () => {
  const { fakes, createStore } = init();

  fakes.stock
    .addDefinition("input")
    .addMethod("reveal", (_args, { atoms: [current] }) => "foo" + current, {
      atoms: ["current"],
    })
    .addInitialAtoms({ current: "bar" });
  const module = fakes.entities.addModule("input");

  const store = createStore();

  const method = store.actions.method(module.id, "reveal");
  const result = await method();
  expect(result).toBe("foobar");
});

it("should update atoms inside of method selector", async () => {
  const { fakes, createStore } = init();

  fakes.stock
    .addDefinition("input")
    .addMethod("reveal", (_args, { updateAtoms }) => {
      updateAtoms({ revealed: true });
    })
    .addInitialAtoms({ revealed: false });
  const module = fakes.entities.addModule("input");

  const store = createStore();

  const method = store.actions.method(module.id, "reveal");
  await method();

  const result = toSync(store.data.atom(module.id, "revealed"));
  expect(result).toBe(true);
});
