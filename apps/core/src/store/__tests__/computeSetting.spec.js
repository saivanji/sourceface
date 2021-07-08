import fake from "../fakes";
import computeSetting from "../computeSetting";

it("should return module setting config field", () => {
  const { fakeRegistry, fakeStock, dependencies } = fake();

  const module = fakeRegistry.addModule("text", {
    config: { content: "Foo bar" },
  });
  fakeStock.addDefinition("text");

  return expect(
    computeSetting(module.id, "content", dependencies).toPromise()
  ).resolves.toBe("Foo bar");
});

it("should compute module setting field", () => {
  const { fakeRegistry, fakeStock, dependencies } = fake();

  const value = fakeRegistry.addConstantVariable(6);
  const stage = fakeRegistry.addStage(value.id, "value");
  const module = fakeRegistry.addModule("text", {
    fields: { content: [stage.id] },
  });
  fakeStock.addDefinition("text");

  return expect(
    computeSetting(module.id, "content", dependencies).toPromise()
  ).resolves.toBe(6);
});
