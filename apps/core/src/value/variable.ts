import { path as selectPath } from "ramda";
import { Variable } from "../types";

// const global = {
//   page: "about",
//   version: "2.1.3",
// };

export const evaluate = (
  definition: Variable
  // scope,
  // getLocal,
  // getMount
) => {
  const path = definition.path || [];
  let value;

  // if (category === "global") {
  //   value = global[payload.name];
  // }

  // TODO: handle cropping "variable/"
  if (definition.category === "variable/constant") {
    value = definition.payload.value;
  }

  // if (category === "module") {
  //   const { property } = payload;
  //   const { module } = references;

  //   value = getLocal(module.id, property);
  // }

  // if (category === "mount") {
  //   const { module } = references;

  //   value = getMount(module.id);
  // }

  // if (category === "argument") {
  //   value = scope.args[payload.property];
  // }

  // if (category === "stage") {
  //   value = scope.stages[payload.name];
  // }

  return selectPath(path, value);
};
