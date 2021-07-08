import FakeRegistry from "../fakes/registry";
import FakeStock from "../fakes/stock";

export default function fake() {
  const fakeRegistry = new FakeRegistry();
  const fakeStock = new FakeStock();

  return {
    fakeRegistry,
    fakeStock,
    dependencies: {
      registry: fakeRegistry.contents(),
      stock: fakeStock.contents(),
    },
  };
}
