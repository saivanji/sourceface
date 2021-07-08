import fake from "../fakes";
import computeAttribute from "../computeAttribute";

it("should compute module attribute without dependencies", () => {
  const { fakeRegistry, fakeStock, dependencies } = fake();

  const module = fakeRegistry.addModule("input");
  fakeStock.addDefinition("input").addAttribute("value", () => "Foo bar");

  return expect(
    computeAttribute(module.id, "value", dependencies).toPromise()
  ).resolves.toBe("Foo bar");
});

it("should compute module attribute with config setting dependency", () => {
  const { fakeRegistry, fakeStock, dependencies } = fake();

  const module = fakeRegistry.addModule("input", {
    config: { initial: "Foo bar" },
  });
  fakeStock
    .addDefinition("input")
    .addAttribute("value", ({ settings: [initial] }) => initial, {
      settings: ["initial"],
    });

  return expect(
    computeAttribute(module.id, "value", dependencies).toPromise()
  ).resolves.toBe("Foo bar");
});

it("should compute module attribute with computed setting dependency", () => {
  const { fakeRegistry, fakeStock, dependencies } = fake();

  const value = fakeRegistry.addConstantVariable("Foo bar");
  const stage = fakeRegistry.addStage(value.id, "value");
  const module = fakeRegistry.addModule("input", {
    fields: { initial: [stage.id] },
  });
  fakeStock
    .addDefinition("input")
    .addAttribute("value", ({ settings: [initial] }) => initial, {
      settings: ["initial"],
    });

  return expect(
    computeAttribute(module.id, "value", dependencies).toPromise()
  ).resolves.toBe("Foo bar");
});

it("should compute module attribute with another attribute dependency", () => {
  const { fakeRegistry, fakeStock, dependencies } = fake();

  const module = fakeRegistry.addModule("input");
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

  return expect(
    computeAttribute(module.id, "error", dependencies).toPromise()
  ).resolves.toBe("This field is required");
});

it("should compute module attribute with atom dependency", () => {
  const { fakeRegistry, fakeStock, dependencies } = fake();

  const module = fakeRegistry.addModule("input");
  fakeRegistry.addAtom(module.id, "current", "Foo bar");
  fakeStock
    .addDefinition("input")
    .addAttribute("value", ({ atoms: [current] }) => current, {
      atoms: ["current"],
    });

  const callback = jest.fn();
  computeAttribute(module.id, "value", dependencies).subscribe(callback);

  expect(callback.mock.calls.length).toBe(1);
  expect(callback.mock.calls[0][0]).toBe("Foo bar");
});

it("should recompute module attribute when atom dependency changed", () => {
  const { fakeRegistry, fakeStock, dependencies } = fake();

  const module = fakeRegistry.addModule("input");
  fakeRegistry.addAtom(module.id, "current", "Foo bar");
  fakeStock
    .addDefinition("input")
    .addAttribute("value", ({ atoms: [current] }) => current, {
      atoms: ["current"],
    });

  const callback = jest.fn();
  computeAttribute(module.id, "value", dependencies).subscribe(callback);

  dependencies.registry.atoms[module.id].current.next("Baz");

  // TODO: should be 1 call instead. Multiple sync dispatches should lead to one
  // subscriber notification
  expect(callback.mock.calls.length).toBe(2);
  expect(callback.mock.calls[0][0]).toBe("Foo bar");
  expect(callback.mock.calls[1][0]).toBe("Baz");
});
