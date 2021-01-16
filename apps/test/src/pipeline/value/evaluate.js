import * as func from "./function";
import * as variable from "./variable";

export default function evaluate(value, accessors) {
  if (value.type === "variable") {
    return variable.evaluate(value.data, accessors);
  }

  if (value.type === "function") {
    const x = func.evaluate(value.data, accessors);

    return x;
  }
}
