import { init, toSync, toSyncSequence } from "../fakes";

it("should compute module attribute without dependencies", () => {
  const { fakes, createStore } = init();

  fakes.stock.addDefinition("input").addAttribute("value", () => "foo");
  const module = fakes.entities.addModule("input");

  const store = createStore();
  const result = toSync(store.data.attribute(module.id, "value"));
  expect(result).toBe("foo");
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

  const store = createStore();
  const result = toSync(store.data.attribute(module.id, "value"));
  expect(result).toBe("default value");
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

  const store = createStore();
  const result = toSync(store.data.attribute(module.id, "value"));
  expect(result).toBe("foo");
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

  const store = createStore();
  const result = toSync(store.data.attribute(module.id, "error"));
  expect(result).toBe("This field is required");
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

  const store = createStore();
  const result = toSyncSequence(store.data.attribute(module.id, "value"));

  expect(result).toEqual(["foo"]);
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

  const store = createStore();
  const result = toSyncSequence(store.data.attribute(module.id, "value"));

  store.actions.updateAtom(module.id, "current", "bar");

  expect(result).toEqual(["foo", "bar"]);
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

  const store = createStore();
  const result = toSyncSequence(store.data.attribute(module.id, "value"));

  store.actions.updateAtom(module.id, "current", "foo");
  expect(result).toEqual(["foo"]);
});

it("should not compute the same attribute twice or more times", () => {
  const { fakes, createStore } = init();

  const mock = jest.fn();

  fakes.stock.addDefinition("input").addAttribute("value", mock);
  const module = fakes.entities.addModule("input");

  const store = createStore();
  toSync(store.data.attribute(module.id, "value"));
  toSync(store.data.attribute(module.id, "value"));

  expect(mock).toBeCalledTimes(1);
});
