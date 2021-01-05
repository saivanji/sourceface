import { keys, zipObj } from "ramda";
import { stock as actionsStock } from "../actions";
import * as variable from "./variable";
import * as cache from "./cache";
import { maybePromise } from "./utils";

export const readSetting = (value, actions, getScopeValue) => {
  if (actions.length) {
    return pipeActions(actions, getScopeValue);
  }

  return value;
};

const pipeActions = (actions, getScopeValue) => {
  return processAction(actions[0], getScopeValue);
};

const processAction = (action, getScopeValue) => {
  const args = evaluateArguments(action.variables, getScopeValue);

  return maybePromise(args, (args) => {
    const cached = cache.get(action.type, args);

    if (cached) {
      return cached;
    }

    const result = actionsStock[action.type].execute(args);

    return maybePromise(result, (result) => {
      cache.set(action.type, args, result);

      return result;
    });
  });
};

const evaluateArguments = (args, getScopeValue) => {
  const variableNames = keys(args);

  const argsList = variableNames.map((name) =>
    variable.evaluate(args[name], getScopeValue)
  );

  return maybePromise(argsList, zipObj(variableNames));
};
