import stringify from "fast-json-stable-stringify";
import { maybePromise } from "../utils";

let store = {};
let timeouts = {};
let calls = {};
const TTL = 3 * 60 * 1000;

const get = (...input) => store[identify(...input)];

const set = (...input) => {
  const identifier = identify(...input.slice(0, -1));

  store[identifier] = input[input.length - 1];

  clearTimeout(timeouts[identifier]);
  timeouts[identifier] = setTimeout(() => {
    delete store[identifier];
    delete timeouts[identifier];
  }, TTL);
};

const register = (...input) => {
  const identifier = identify(...input.slice(0, -1));

  // calls[identifier] =
};

/**
 * Function responsible for handling duplicating async requests.
 *
 * When new async function is called, it gets registered in the store so the next call of the same function
 * gets suspended until the initial function call is resolved.
 */
export const load = (id, fn, args, references) => {
  const fromCache = get(id, args);

  if (fromCache) {
    return fromCache;
  }

  // if call is not registered - register and proceed
  // if call is registered suspend and wait for initial function to resolve
  // no need to keep flags for isFetching and so on since we might get that by checking the cache

  const result = fn(args, references);

  return maybePromise([result], ([result]) => {
    set(id, args, result);

    return result;
  });
};

const identify = (id, args) => `${id}/${stringify(args)}`;
