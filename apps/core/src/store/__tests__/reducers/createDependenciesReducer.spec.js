import { createDependeciesReducer } from "../../reducers";
import FakeState from "../../../fakes/state";
import FakeStock from "../../../fakes/stock";
import * as slices from "../../slices";

it("should recompute all attributes dependent in any way on atom during single update", () => {
  const fakeState = new FakeState();
  const fakeStock = new FakeStock();

  fakeStock.addDefinition("test_module_type", {
    attributes: {
      foo: {
        selector: ({ atoms: [a] }) => `a:${a}_foo`,
        atoms: ["a"],
      },
      bar: {
        selector: ({ attributes: [foo] }) => `${foo}_bar`,
        attributes: ["foo"],
      },
    },
    atomDependencies: {
      a: ["foo", "bar"],
    },
  });

  const [moduleId] = fakeState.addModule("test_module_type");
  fakeState.replaceAtoms(moduleId, { a: 70 });

  const state = fakeState.contents();
  const stock = fakeStock.contents();

  const reducer = createDependeciesReducer(stock);
  const action = slices.atoms.actions.update({
    moduleId,
    key: "a",
    nextValue: 70,
    dependencies: {},
  });

  const nextState = reducer(state, action);

  expect(nextState.attributes[moduleId].foo).toBe("a:70_foo");
  expect(nextState.attributes[moduleId].bar).toBe("a:70_foo_bar");
});
