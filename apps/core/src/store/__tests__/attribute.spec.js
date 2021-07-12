import { init } from "../fakes";

it("should compute module attribute without dependencies", () => {
  const { fakes, createStore } = init();

  fakes.stock.addDefinition("input").addAttribute("value", () => "foo");
  const module = fakes.entities.addModule("input");

  const callback = jest.fn();
  const store = createStore();
  store.data.attribute(module.id, "value").subscribe(callback);
  expect(callback).toBeCalledWith("foo");
});

it("should compute module attribute with config setting dependency", () => {
  const { fakes, createStore } = init();

  fakes.stock
    .addDefinition("input")
    .addAttribute("value", ({ settings: [initial] }) => initial, {
      settings: ["initial"],
    });
  const module = fakes.entities.addModule("input", {
    config: { initial: "default value" },
  });

  const callback = jest.fn();
  const store = createStore();
  store.data.attribute(module.id, "value").subscribe(callback);
  expect(callback).toBeCalledWith("default value");
});

it("should compute module attribute with computed setting dependency", () => {
  const { fakes, createStore } = init();

  fakes.stock
    .addDefinition("input")
    .addAttribute("value", ({ settings: [initial] }) => initial, {
      settings: ["initial"],
    });
  const value = fakes.entities.addConstantVariable("foo");
  const stage = fakes.entities.addValueStage(value.id);
  const module = fakes.entities.addModule("input", {
    fields: { initial: [stage.id] },
  });

  const callback = jest.fn();
  const store = createStore();
  store.data.attribute(module.id, "value").subscribe(callback);
  expect(callback).toBeCalledWith("foo");
});

it("should compute module attribute with another attribute dependency", () => {
  const { fakes, createStore } = init();

  fakes.stock
    .addDefinition("input")
    .addAttribute(
      "error",
      ({ attributes: [touched] }) =>
        touched ? "This field is required" : undefined,
      {
        attributes: ["touched"],
      }
    )
    .addAttribute("touched", () => true);
  const module = fakes.entities.addModule("input");

  const callback = jest.fn();
  const store = createStore();
  store.data.attribute(module.id, "error").subscribe(callback);
  expect(callback).toBeCalledWith("This field is required");
});

it("should compute module attribute with atom dependency", () => {
  const { fakes, createStore } = init();

  fakes.stock
    .addDefinition("input")
    .addAttribute("value", ({ atoms: [current] }) => current, {
      atoms: ["current"],
    })
    .addInitialAtoms({ current: "foo" });
  const module = fakes.entities.addModule("input");

  const callback = jest.fn();
  const store = createStore();
  store.data.attribute(module.id, "value").subscribe(callback);

  expect(callback).toBeCalledTimes(1);
  expect(callback).toHaveBeenCalledWith("foo");
});

it("should recompute module attribute when atom dependency changed", () => {
  const { fakes, createStore } = init();

  fakes.stock
    .addDefinition("input")
    .addAttribute("value", ({ atoms: [current] }) => current, {
      atoms: ["current"],
    })
    .addInitialAtoms({ current: "foo" });
  const module = fakes.entities.addModule("input");

  const callback = jest.fn();
  const store = createStore();
  store.data.attribute(module.id, "value").subscribe(callback);

  store.actions.updateAtom(module.id, "current", "bar");

  expect(callback).toBeCalledTimes(2);
  expect(callback.mock.calls[0][0]).toBe("foo");
  expect(callback.mock.calls[1][0]).toBe("bar");
});

it("should not emit if the next value is the same as the previous one", () => {
  const { fakes, createStore } = init();

  fakes.stock
    .addDefinition("input")
    .addAttribute("value", ({ atoms: [current] }) => current, {
      atoms: ["current"],
    })
    .addInitialAtoms({ current: "foo" });
  const module = fakes.entities.addModule("input");

  const callback = jest.fn();
  const store = createStore();
  store.data.attribute(module.id, "value").subscribe(callback);

  store.actions.updateAtom(module.id, "current", "foo");
  expect(callback).toBeCalledTimes(1);
});

it("should not compute the same attribute twice or more times", () => {
  const { fakes, createStore } = init();

  const mock = jest.fn();

  fakes.stock.addDefinition("input").addAttribute("value", mock);
  const module = fakes.entities.addModule("input");

  const store = createStore();
  store.data.attribute(module.id, "value").subscribe(jest.fn);
  store.data.attribute(module.id, "value").subscribe(jest.fn);

  expect(mock).toBeCalledTimes(1);
});
