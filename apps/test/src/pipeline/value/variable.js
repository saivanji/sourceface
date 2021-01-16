import { path as selectPath } from "ramda";
import { maybePromise } from "../../utils";

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
  accessors
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

    value = accessors.local("variable", module.id, property);
  }

  if (category === "mount") {
    const { module } = references;

    value = accessors.mount(module.id);
  }

  return maybePromise([value], ([value]) => selectPath(path, value));
};
