import stringify from "fast-json-stable-stringify";

let store = {};
let timeouts = {};
const TTL = 3 * 60 * 1000;

export const get = (...input) => store[identify(...input)];

export const set = (...input) => {
  const identifier = identify(...input.slice(0, -1));

  store[identifier] = input[input.length - 1];

  clearTimeout(timeouts[identifier]);
  timeouts[identifier] = setTimeout(() => {
    delete store[identifier];
    delete timeouts[identifier];
  }, TTL);
};

const identify = (moduleId, field, args) =>
  `${moduleId}/${field}/${stringify(args)}`;
