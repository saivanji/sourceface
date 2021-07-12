import fake from "../fakes";
import computeValue from "../computeValue";

it("should compute constant variable value", () => {
  const { fakeRegistry, dependencies } = fake();

  const value = fakeRegistry.addConstantVariable(6);

  const callback = jest.fn();
  computeValue(value.id, dependencies).subscribe(callback);
  expect(callback).toBeCalledWith(6);
});

it("should compute attribute variable value", () => {
  const { fakeRegistry, fakeStock, dependencies } = fake();

  fakeStock.addDefinition("input").addAttribute("value", () => "some text");
  const module = fakeRegistry.addModule("input");
  const value = fakeRegistry.addAttributeVariable(module.id, "value");

  const callback = jest.fn();
  computeValue(value.id, dependencies).subscribe(callback);
  expect(callback).toBeCalledWith("some text");
});

it("should throw an error when value is not found in registry", () => {
  const { dependencies } = fake();

  const callback = jest.fn();
  computeValue(1, dependencies).subscribe(jest.fn, callback);
  expect(callback).toBeCalledWith(new Error("Can not find value in registry"));
});

it("should throw an error when unrecognized value category supplied", () => {
  const { fakeRegistry, dependencies } = fake();

  const value = fakeRegistry.addValue("wrong");

  const callback = jest.fn();
  computeValue(value.id, dependencies).subscribe(jest.fn, callback);
  return expect(callback).toBeCalledWith(
    new Error("Unrecognized value category")
  );
});
