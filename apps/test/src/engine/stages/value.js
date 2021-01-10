import * as variable from "../variable";

export const execute = (values, getScopeVariable) => {
  const { type, data } = values.root;

  if (type === "variable") {
    return variable.evaluate(data, getScopeVariable);
  }
};
