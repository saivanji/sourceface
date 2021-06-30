import FakeState from "../../../../fakes/state";
import FakeStock from "../../../../fakes/stock";
import { computeValue } from "../../computation";
import * as computation from "../../computation";
import { ImpureComputation } from "../../../exceptions";

const purityOptions = [true, false];

it("throws with ImpureComputation when trying to compute future function in pure mode", () => {
  const { fakeState, fakeStock } = prepare();

  const [valueId] = fakeState.addOperationFutureFunction();
  const state = fakeState.contents();
  const stock = fakeStock.contents();

  expect(() => computeValue(valueId, state, stock, true)).toThrowError(
    ImpureComputation
  );
});

it.each(purityOptions)("computes constant variable when pure is %s", (pure) => {
  const { fakeState, fakeStock } = prepare();

  const [valueId] = fakeState.addConstantVariable("foo");
  const state = fakeState.contents();
  const stock = fakeStock.contents();

  expect(computeValue(valueId, state, stock, pure)).toEqual("foo");
});

it.each(purityOptions)(
  "computes attribute variable when pure is %s",
  (pure) => {
    const { fakeState, fakeStock } = prepare();
    const attributeKey = "value";

    const [moduleId] = fakeState.addModule("text");
    const [valueId] = fakeState.addAttributeVariable(moduleId, attributeKey);

    const state = fakeState.contents();
    const stock = fakeStock.contents();

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

function prepare() {
  const fakeState = new FakeState();
  const fakeStock = new FakeStock();

  return { fakeState, fakeStock };
}
