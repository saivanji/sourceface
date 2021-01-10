import { plural, maybePromise } from "./utils";
import { readSetting } from "./setting";

// readScopeFunction
export const readScopeVariable = (
  key,
  blueprint,
  config,
  state,
  getActions,
  getScopeVariable
) => {
  const setup = blueprint.variables[key];

  const settings = plural(setup.settings, (field) =>
    readSetting(config?.[field], getActions(field), getScopeVariable)
  );

  const variables = plural(setup.variables, (key) =>
    readScopeVariable(
      key,
      blueprint,
      config,
      state,
      getActions,
      getScopeVariable
    )
  );

  return maybePromise(settings, variables, (settings, variables) =>
    setup.selector(state, { settings, variables })
  );
};
