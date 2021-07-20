import setWith from "lodash.setwith";
import Bucket from "./bucket";
import Cache from "./cache";

export const set = (...args) => setWith(...args, Object);

export const createCacheBucket = (ttl) => new Bucket(Cache, ttl);

export function toPromise(stream) {
  return new Promise((resolve, reject) => {
    const subscriber = stream.subscribe(
      (result) => {
        /**
         * Unsubscribing since we're interested only in first value.
         */
        subscriber.unsubscribe();

        resolve(result);
      },
      (err) => {
        reject(err);
      }
    );
  });
}
