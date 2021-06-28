import FakeState from "../../../../fakes/state";
import FakeStock from "../../../../fakes/stock";
import { computeValue } from "../../computation";
import * as computation from "../../computation";
import { ImpureComputation } from "../../../exceptions";

const purityOptions = [true, false];

beforeEach(() => {
  global.fakeState = new FakeState();
  global.fakeStock = new FakeStock();
});

it("throws with ImpureComputation when trying to compute future function in pure mode", () => {
  const [valueId] = global.fakeState.addOperationFutureFunction();
  const state = global.fakeState.contents();
  const stock = global.fakeStock.contents();

  expect(() => computeValue(valueId, state, stock, true)).toThrowError(
    ImpureComputation
  );
});

it.each(purityOptions)("computes constant variable when pure is %s", (pure) => {
  const [valueId] = global.fakeState.addConstantVariable("foo");
  const state = global.fakeState.contents();
  const stock = global.fakeStock.contents();

  expect(computeValue(valueId, state, stock, pure)).toEqual("foo");
});

it.each(purityOptions)(
  "computes attribute variable when pure is %s",
  (pure) => {
    const attributeKey = "value";

    const [moduleId] = global.fakeState.addModule("text");
    const [valueId] = global.fakeState.addAttributeVariable(
      moduleId,
      attributeKey
    );

    const state = global.fakeState.contents();
    const stock = global.fakeStock.contents();

    const spy = jest
      .spyOn(computation, "computeAttribute")
      .mockImplementation(() => "mocked");

    expect(computation.computeValue(valueId, state, stock, pure)).toEqual(
      "mocked"
    );
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(
      moduleId,
      attributeKey,
      state,
      stock,
      pure
    );
  }
);
