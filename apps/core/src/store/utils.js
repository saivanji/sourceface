import { first } from "rxjs/operators";
import setWith from "lodash.setwith";
import Bucket from "./bucket";
import Cache from "./cache";

export const set = (...args) => setWith(...args, Object);

export const createCacheBucket = (ttl) => new Bucket(Cache, ttl);

export function toPromise(stream) {
  return new Promise((resolve, reject) => {
    stream.pipe(first()).subscribe(
      (result) => {
        resolve(result);
      },
      (err) => {
        reject(err);
      }
    );
  });
}
