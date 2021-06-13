import { path as selectPath } from "ramda";
// TODO: import selectors directly here?

const global = {
  page: "about",
  version: "2.1.3",
};

// TODO: there will be a special syntax where user can enter * when types variable name in the "Value" component. In that case Value will return an object
// with keys as patterns. Like `form_*.value` will return object with keys as patterns and "value" fields as values
//
// The same applies to functions: `form_*.justify` will call justify functions on desired modules and return an object with results.

export const evaluate = (
  { category, payload, references, path = [] },
  scope,
  getLocal,
  getMount
) => {
  let value;

  if (category === "global") {
    value = global[payload.name];
  }

  if (category === "constant") {
    value = payload.value;
  }

  if (category === "module") {
    const { property } = payload;
    const { module } = references;

    return processAsync(getLocal(module.id, property), selectPath(path));
  }

  if (category === "mount") {
    const { module } = references;

    return processAsync(getMount(module.id), selectPath(path));
  }

  if (category === "argument") {
    value = scope.args[payload.property];
  }

  if (category === "stage") {
    value = scope.stages[payload.name];
  }

  return selectPath(path, value);
};

const processAsync = (value, fn) => {
  if (value instanceof Promise) {
    return value.then(fn);
  }

  return fn(value);
};
