import { plural, maybePromise } from "./utils";
import { readSetting } from "./setting";

export const readScopeValue = (
  key,
  blueprint,
  config,
  state,
  getActions,
  getScopeValue
) => {
  const setup = blueprint.scope[key];

  const settings = plural(setup.settings, (field) =>
    readSetting(config?.[field], getActions(field), getScopeValue)
  );

  const scope = plural(setup.scope, (key) =>
    readScopeValue(key, blueprint, config, state, getActions, getScopeValue)
  );

  return maybePromise(settings, scope, (settings, scope) =>
    setup.selector(state, { settings, scope })
  );
};
