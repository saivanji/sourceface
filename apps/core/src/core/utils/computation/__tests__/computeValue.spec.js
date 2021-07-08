import FakeState from "../../../../fakes/state";
import FakeStock from "../../../../fakes/stock";
import { ImpureComputation } from "../../../exceptions";
import computeValue from "../computeValue";
import * as computeAttribute from "../computeAttribute";

const purityOptions = [true, false];

it("throws with ImpureComputation when trying to compute future function in pure mode", () => {
  const { fakeState, fakeStock } = prepare();

  const [valueId] = fakeState.addOperationFutureFunction();
  const state = fakeState.contents();
  const stock = fakeStock.contents();

  expect(() =>
    computeValue(valueId, { deps: { state, stock }, opts: { pure: true } })
  ).toThrowError(ImpureComputation);
});

it.each(purityOptions)("computes constant variable when pure is %s", (pure) => {
  const { fakeState, fakeStock } = prepare();

  const [valueId] = fakeState.addConstantVariable("foo");
  const state = fakeState.contents();
  const stock = fakeStock.contents();

  expect(
    computeValue(valueId, { deps: { state, stock }, opts: { pure } })
  ).toEqual("foo");
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
      .spyOn(computeAttribute, "default")
      .mockImplementation(() => "mocked");

    expect(
      computeValue(valueId, {
        deps: { state, stock },
        opts: { pure },
      })
    ).toEqual("mocked");
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(moduleId, attributeKey, {
      deps: { state, stock },
      opts: { pure },
    });
  }
);

function prepare() {
  const fakeState = new FakeState();
  const fakeStock = new FakeStock();

  return { fakeState, fakeStock };
}
