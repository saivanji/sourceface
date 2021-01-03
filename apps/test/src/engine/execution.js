import { keys, zipObj } from "ramda";
import { stock as actionsStock } from "../actions";
import * as variable from "./variable";
import * as cache from "./cache";

export const readSetting = (key, module, getScopeValue) => {
  // TODO: in future, when no action will be available return config value in that place
  const action = module.settings[key];

  /**
   * Explicitly returning null if setting is not defined.
   */
  if (!action) {
    return null;
  }

  const args = evaluateArguments(action.variables, getScopeValue);

  return maybePromise(args, (args) => {
    const cached = cache.get(module.id, key, args);

    if (cached) {
      return cached;
    }

    const result = actionsStock[action.name].execute(args);

    return maybePromise(result, (result) => {
      cache.set(module.id, key, args, result);

      return result;
    });
  });
};

export const readScopeValue = (
  key,
  module,
  blueprint,
  state,
  getScopeValue
) => {
  const settings = plural(blueprint.scope?.[key].settings, (key) =>
    readSetting(key, module, getScopeValue)
  );

  const scope = plural(blueprint.scope?.[key].scope, (key) =>
    readScopeValue(key, module, blueprint, state, getScopeValue)
  );

  return maybePromise(settings, scope, (settings, scope) =>
    blueprint.scope[key].selector(state, { settings, scope })
  );
};

export const plural = (keys = [], fn) =>
  maybePromise(...keys.map(fn), (...args) => args);

const evaluateArguments = (args, getScopeValue) => {
  const variableNames = keys(args);

  const argsList = variableNames.map((name) =>
    variable.evaluate(args[name], getScopeValue)
  );

  return maybePromise(argsList, zipObj(variableNames));
};

const maybePromise = (...args) => {
  const items = args.slice(0, -1);
  const fn = args[args.length - 1];

  const isPromise = items.some((x) => x instanceof Promise);

  if (isPromise) {
    return Promise.all(items).then((result) => fn(...result));
  }

  return fn(...items);
};
