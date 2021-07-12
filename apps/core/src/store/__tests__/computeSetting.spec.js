import fake from "../fakes";
import computeSetting from "../computeSetting";
import * as computeValue from "../computeValue";

it("should return module setting config field", () => {
  const { fakeRegistry, fakeStock, dependencies } = fake();

  fakeStock.addDefinition("text");
  const module = fakeRegistry.addModule("text", {
    config: { content: "some text" },
  });

  const callback = jest.fn();
  computeSetting(module.id, "content", dependencies).subscribe(callback);
  expect(callback).toBeCalledWith("some text");
});

it("should return module initial setting config field", () => {
  const { fakeRegistry, fakeStock, dependencies } = fake();

  fakeStock
    .addDefinition("text")
    .addInitialConfig({ content: "default value" });
  const module = fakeRegistry.addModule("text");

  const callback = jest.fn();
  computeSetting(module.id, "content", dependencies).subscribe(callback);
  expect(callback).toBeCalledWith("default value");
});

it("should compute module setting field", () => {
  const { fakeRegistry, fakeStock, dependencies } = fake();

  fakeStock.addDefinition("text");
  const value = fakeRegistry.addConstantVariable(6);
  const stage = fakeRegistry.addValueStage(value.id);
  const module = fakeRegistry.addModule("text", {
    fields: { content: [stage.id] },
  });

  const callback = jest.fn();
  computeSetting(module.id, "content", dependencies).subscribe(callback);
  expect(callback).toBeCalledWith(6);
});

it("should compute module setting field consisting out of multiple stages", () => {
  const { fakeRegistry, fakeStock, dependencies } = fake();

  fakeStock.addDefinition("text");
  const value1 = fakeRegistry.addConstantVariable("foo");
  const stage1 = fakeRegistry.addValueStage(value1.id);
  const value2 = fakeRegistry.addConstantVariable("bar");
  const stage2 = fakeRegistry.addValueStage(value2.id);
  const value3 = fakeRegistry.addConstantVariable("baz");
  const stage3 = fakeRegistry.addValueStage(value3.id);

  const module = fakeRegistry.addModule("text", {
    fields: { content: [stage1.id, stage2.id, stage3.id] },
  });

  const callback = jest.fn();
  computeSetting(module.id, "content", dependencies).subscribe(callback);
  expect(callback).toBeCalledWith("baz");
});

it("should throw an error if unrecognized stage type provided", () => {
  const { fakeRegistry, fakeStock, dependencies } = fake();

  fakeStock.addDefinition("text");
  const stage = fakeRegistry.addStage("wrong");
  const module = fakeRegistry.addModule("text", {
    fields: { content: [stage.id] },
  });

  const callback = jest.fn();
  computeSetting(module.id, "content", dependencies).subscribe(
    jest.fn,
    callback
  );
  expect(callback).toBeCalledWith(new Error("Unrecognized stage type"));
});

it("should not compute the same setting twice or more times", () => {
  const { fakeRegistry, fakeStock, dependencies } = fake();

  fakeStock.addDefinition("text");
  const value = fakeRegistry.addConstantVariable({ x: 1 });
  const stage = fakeRegistry.addValueStage(value.id);
  const module = fakeRegistry.addModule("text", {
    fields: { content: [stage.id] },
  });

  const spy = jest.spyOn(computeValue, "default");

  computeSetting(module.id, "content", dependencies).subscribe(jest.fn);
  computeSetting(module.id, "content", dependencies).subscribe(jest.fn);

  expect(spy).toBeCalledTimes(1);
});
