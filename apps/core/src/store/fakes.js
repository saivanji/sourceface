import FakeRegistry from "../fakes/registry";
import FakeEntities from "../fakes/entities";
import FakeStock from "../fakes/stock";
import FakeFutures from "../fakes/futures";
import { createStore } from "./";

// TODO: will be moved to jest configuration
export default function fake() {
  const fakeRegistry = new FakeRegistry();
  const fakeStock = new FakeStock();
  const fakeFutures = new FakeFutures();

  return {
    fakeRegistry,
    fakeStock,
    fakeFutures,
    dependencies: {
      registry: fakeRegistry.contents(),
      stock: fakeStock.contents(),
      futures: fakeFutures.contents(),
    },
  };
}

export function init() {
  const fakeEntities = new FakeEntities();
  const fakeStock = new FakeStock();
  const fakeFutures = new FakeFutures();
  const store = createStore(
    fakeEntities.contents(),
    fakeStock.contents(),
    fakeFutures.contents()
  );

  return {
    fakeEntities,
    fakeStock,
    store,
  };
}
