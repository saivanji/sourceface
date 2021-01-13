import { func, variable } from "../value";

export const execute = (values, getScopeVariable) => {
  const { type, data } = values.root;

  if (type === "variable") {
    return variable.evaluate(data, getScopeVariable);
  }

  if (type === "function") {
    return func.evaluate(data, getScopeVariable);
  }
};
