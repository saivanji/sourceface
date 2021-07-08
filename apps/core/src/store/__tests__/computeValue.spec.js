import fake from "../fakes";
import computeValue from "../computeValue";

it("should compute constant variable value", () => {
  const { fakeRegistry, dependencies } = fake();

  const value = fakeRegistry.addConstantVariable(6);

  return expect(computeValue(value.id, dependencies).toPromise()).resolves.toBe(
    6
  );
});

it("should compute attribute variable value", () => {
  const { fakeRegistry, fakeStock, dependencies } = fake();

  const module = fakeRegistry.addModule("input");
  const value = fakeRegistry.addAttributeVariable(module.id, "value");
  fakeStock.addDefinition("input").addAttribute("value", () => "Foo bar");

  return expect(computeValue(value.id, dependencies).toPromise()).resolves.toBe(
    "Foo bar"
  );
});
