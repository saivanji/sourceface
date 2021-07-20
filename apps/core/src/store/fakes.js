import FakeEntities from "../fakes/entities";
import FakeStock from "../fakes/stock";
import FakeFutures from "../fakes/futures";
import { createStore, createCacheBucket } from "./";

// TODO: will be moved to jest configuration
export function init() {
  const entities = new FakeEntities();
  const stock = new FakeStock();
  const futures = new FakeFutures();

  const create = ({ futuresTTL } = {}) =>
    createStore(
      entities.contents(),
      stock.contents(),
      futures.contents(),
      futuresTTL && {
        futuresCache: createCacheBucket(futuresTTL),
      }
    );

  return {
    fakes: {
      entities,
      stock,
      futures,
    },
    createStore: create,
  };
}
