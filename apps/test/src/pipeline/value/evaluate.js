import * as func from "./function";
import * as variable from "./variable";

export default function evaluate(value, getLocal) {
  if (value.type === "variable") {
    return variable.evaluate(value.data, getLocal);
  }

  if (value.type === "function") {
    const x = func.evaluate(value.data, getLocal);

    return x;
  }
}
