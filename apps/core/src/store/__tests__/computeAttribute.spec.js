import fake from "../fakes";
import computeAttribute from "../computeAttribute";

it("should compute module attribute without dependencies", () => {
  const { fakeRegistry, fakeStock, dependencies } = fake();

  fakeStock.addDefinition("input").addAttribute("value", () => "Foo bar");
  const module = fakeRegistry.addModule("input");

  const callback = jest.fn();
  computeAttribute(module.id, "value", dependencies).subscribe(callback);
  expect(callback).toBeCalledWith("Foo bar");
});

it("should compute module attribute with config setting dependency", () => {
  const { fakeRegistry, fakeStock, dependencies } = fake();

  fakeStock
    .addDefinition("input")
    .addAttribute("value", ({ settings: [initial] }) => initial, {
      settings: ["initial"],
    });
  const module = fakeRegistry.addModule("input", {
    config: { initial: "default value" },
  });

  const callback = jest.fn();
  computeAttribute(module.id, "value", dependencies).subscribe(callback);
  expect(callback).toBeCalledWith("default value");
});

it("should compute module attribute with computed setting dependency", () => {
  const { fakeRegistry, fakeStock, dependencies } = fake();

  fakeStock
    .addDefinition("input")
    .addAttribute("value", ({ settings: [initial] }) => initial, {
      settings: ["initial"],
    });
  const value = fakeRegistry.addConstantVariable("foo");
  const stage = fakeRegistry.addValueStage(value.id);
  const module = fakeRegistry.addModule("input", {
    fields: { initial: [stage.id] },
  });

  const callback = jest.fn();
  computeAttribute(module.id, "value", dependencies).subscribe(callback);
  expect(callback).toBeCalledWith("foo");
});

it("should compute module attribute with another attribute dependency", () => {
  const { fakeRegistry, fakeStock, dependencies } = fake();

  fakeStock
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
  const module = fakeRegistry.addModule("input");

  const callback = jest.fn();
  computeAttribute(module.id, "error", dependencies).subscribe(callback);
  expect(callback).toBeCalledWith("This field is required");
});

it("should compute module attribute with atom dependency", () => {
  const { fakeRegistry, fakeStock, dependencies } = fake();

  fakeStock
    .addDefinition("input")
    .addAttribute("value", ({ atoms: [current] }) => current, {
      atoms: ["current"],
    });
  const module = fakeRegistry.addModule("input");
  fakeRegistry.addAtom(module.id, "current", "foo");

  const callback = jest.fn();
  computeAttribute(module.id, "value", dependencies).subscribe(callback);

  expect(callback).toBeCalledTimes(1);
  expect(callback).toHaveBeenCalledWith("foo");
});

it("should recompute module attribute when atom dependency changed", () => {
  const { fakeRegistry, fakeStock, dependencies } = fake();

  fakeStock
    .addDefinition("input")
    .addAttribute("value", ({ atoms: [current] }) => current, {
      atoms: ["current"],
    });
  const module = fakeRegistry.addModule("input");
  fakeRegistry.addAtom(module.id, "current", "foo");

  const callback = jest.fn();
  computeAttribute(module.id, "value", dependencies).subscribe(callback);

  dependencies.registry.atoms[module.id].current.next("bar");

  expect(callback).toBeCalledTimes(2);
  expect(callback.mock.calls[0][0]).toBe("foo");
  expect(callback.mock.calls[1][0]).toBe("bar");
});

it("should not compute the same attribute twice or more times", () => {
  const { fakeRegistry, fakeStock, dependencies } = fake();

  const mock = jest.fn();

  fakeStock.addDefinition("input").addAttribute("value", mock);
  const module = fakeRegistry.addModule("input");

  computeAttribute(module.id, "value", dependencies).subscribe(jest.fn);
  computeAttribute(module.id, "value", dependencies).subscribe(jest.fn);

  expect(mock).toBeCalledTimes(1);
});

it("should not emit if the next value is the same as the previous one", () => {
  const { fakeRegistry, fakeStock, dependencies } = fake();

  fakeStock
    .addDefinition("input")
    .addAttribute("value", ({ atoms: [current] }) => current, {
      atoms: ["current"],
    });
  const module = fakeRegistry.addModule("input");
  fakeRegistry.addAtom(module.id, "current", "foo");

  const callback = jest.fn();
  computeAttribute(module.id, "value", dependencies).subscribe(callback);

  dependencies.registry.atoms[module.id].current.next("foo");

  expect(callback).toBeCalledTimes(1);
});
