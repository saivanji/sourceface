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

it("should throw an error when value is not found in registry", () => {
  const { dependencies } = fake();

  return expect(computeValue(1, dependencies).toPromise()).rejects.toEqual(
    new Error("Can not find value in registry")
  );
});

it("should throw an error when unrecognized value category supplied", () => {
  const { fakeRegistry, dependencies } = fake();

  const value = fakeRegistry.addValue("wrong");

  return expect(
    computeValue(value.id, dependencies).toPromise()
  ).rejects.toEqual(new Error("Unrecognized value category"));
});
