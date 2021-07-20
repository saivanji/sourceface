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

export function toSync(value) {
  return toSyncSequence(value)[0];
}

export function toSyncSequence(value) {
  let result = [];

  value.subscribe(
    (data) => {
      result.push(data);
    },
    (err) => {
      /* istanbul ignore next */
      throw err;
    }
  );

  return result;
}

export function toAsyncSequence(n, value) {
  let i = 0;
  let result = [];

  return new Promise((resolve, reject) => {
    const subscriber = value.subscribe(
      (data) => {
        i++;
        result.push(data);

        if (n === i) {
          subscriber.unsubscribe();
          resolve(result);
        }
      },
      (err) => {
        /* istanbul ignore next */
        reject(err);
      }
    );
  });
}
