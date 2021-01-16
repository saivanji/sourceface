import * as func from "./function";
import * as variable from "./variable";

export default function evaluate(value, accessors, scope) {
  if (value.type === "variable") {
    return variable.evaluate(value.data, accessors, scope);
  }

  if (value.type === "function") {
    return func.evaluate(value.data, accessors, scope);
  }
}
