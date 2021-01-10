import { plural, maybePromise } from "./utils";
import { readSetting } from "./setting";

// TODO: rename to execution
export const readLocal = (
  type,
  key,
  blueprint,
  config,
  state,
  getSequence,
  getLocal,
  setState
) => {
  const setup = blueprint[keys[type]][key];

  const settings = plural(setup.settings, (field) =>
    readSetting(config?.[field], getSequence(field), getLocal)
  );

  const variables = plural(setup.variables, (key) =>
    readLocal(
      "variable",
      key,
      blueprint,
      config,
      state,
      getSequence,
      getLocal,
      setState
    )
  );

  return maybePromise(settings, variables, (settings, variables) => {
    const dependencies = { settings, variables };

    if (type === "variable") {
      return setup.selector(state, dependencies);
    }

    if (type === "function") {
      return (args) => setup.call(args, state, setState, dependencies);
    }
  });
};

const keys = {
  variable: "variables",
  function: "functions",
};
