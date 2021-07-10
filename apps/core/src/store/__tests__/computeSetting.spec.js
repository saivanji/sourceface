import fake from "../fakes";
import computeSetting from "../computeSetting";
import * as computeValue from "../computeValue";

it("should return module setting config field", () => {
  const { fakeRegistry, fakeStock, dependencies } = fake();

  const module = fakeRegistry.addModule("text", {
    config: { content: "foo" },
  });
  fakeStock.addDefinition("text");

  return expect(
    computeSetting(module.id, "content", dependencies).toPromise()
  ).resolves.toBe("foo");
});

it("should return module initial setting config field", () => {
  const { fakeRegistry, fakeStock, dependencies } = fake();

  const module = fakeRegistry.addModule("text");
  fakeStock.addDefinition("text").addInitialConfig({ content: "foo" });

  return expect(
    computeSetting(module.id, "content", dependencies).toPromise()
  ).resolves.toBe("foo");
});

it("should compute module setting field", () => {
  const { fakeRegistry, fakeStock, dependencies } = fake();

  const value = fakeRegistry.addConstantVariable(6);
  const stage = fakeRegistry.addValueStage(value.id);
  const module = fakeRegistry.addModule("text", {
    fields: { content: [stage.id] },
  });
  fakeStock.addDefinition("text");

  return expect(
    computeSetting(module.id, "content", dependencies).toPromise()
  ).resolves.toBe(6);
});

it("should compute module setting field consisting out of multiple stages", () => {
  const { fakeRegistry, fakeStock, dependencies } = fake();

  const value1 = fakeRegistry.addConstantVariable("foo");
  const stage1 = fakeRegistry.addValueStage(value1.id);
  const value2 = fakeRegistry.addConstantVariable("bar");
  const stage2 = fakeRegistry.addValueStage(value2.id);
  const value3 = fakeRegistry.addConstantVariable("baz");
  const stage3 = fakeRegistry.addValueStage(value3.id);

  const module = fakeRegistry.addModule("text", {
    fields: { content: [stage1.id, stage2.id, stage3.id] },
  });
  fakeStock.addDefinition("text");

  return expect(
    computeSetting(module.id, "content", dependencies).toPromise()
  ).resolves.toBe("baz");
});

it("should throw an error if unrecognized stage type provided", () => {
  const { fakeRegistry, fakeStock, dependencies } = fake();

  const stage = fakeRegistry.addStage("wrong");
  const module = fakeRegistry.addModule("text", {
    fields: { content: [stage.id] },
  });
  fakeStock.addDefinition("text");

  return expect(
    computeSetting(module.id, "content", dependencies).toPromise()
  ).rejects.toEqual(new Error("Unrecognized stage type"));
});

it("should not compute the same setting twice or more times", async () => {
  const { fakeRegistry, fakeStock, dependencies } = fake();

  const value = fakeRegistry.addConstantVariable({ x: 1 });
  const stage = fakeRegistry.addValueStage(value.id);
  const module = fakeRegistry.addModule("text", {
    fields: { foo: [stage.id] },
  });
  fakeStock.addDefinition("text");

  const spy = jest.spyOn(computeValue, "default");

  await computeSetting(module.id, "foo", dependencies).toPromise();
  await computeSetting(module.id, "foo", dependencies).toPromise();

  expect(spy).toBeCalledTimes(1);
});
