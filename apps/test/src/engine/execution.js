import { keys, zipObj } from "ramda";
import { stock as actionsStock } from "../actions";
import * as variable from "./variable";
import * as cache from "./cache";

export const readSetting = (key, module, getScopeValue) => {
  // TODO: in future, when no action will be available return config value in that place
  const action = module.settings[key];
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
  const settings = plural(blueprint.dependencies.scope[key], (key) =>
    readSetting(key, module, getScopeValue)
  );

  return maybePromise(settings, (settings) =>
    blueprint.scope[key](state, settings)
  );
};

export const plural = (keys, fn) => {
  const result = keys.map(fn);
  const isPromise = result.some((x) => x instanceof Promise);

  return isPromise ? Promise.all(result) : result;
};

const evaluateArguments = async (args, getScopeValue) => {
  const variableNames = keys(args);

  const argsList = await Promise.all(
    variableNames.map((name) => variable.evaluate(args[name], getScopeValue))
  );

  return zipObj(variableNames, argsList);
};

const maybePromise = (x, fn) => (x instanceof Promise ? x.then(fn) : fn(x));
