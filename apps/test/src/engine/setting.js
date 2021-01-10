import { keys, zipObj } from "ramda";
import { stock as actionsStock } from "../actions";
import * as variable from "./variable";
import * as cache from "./cache";
import { maybePromise, reduce } from "./utils";

export const readSetting = (value, actions, getScopeVariable) => {
  if (actions.length) {
    return pipeActions(actions, getScopeVariable);
  }

  return value;
};

/**
 * Indicates interruption of actions pipeline.
 */
export class Break {
  constructor(reason) {
    this.reason = reason;
  }
}

const pipeActions = (actions, getScopeVariable) => {
  return reduce(
    (acc, action) => processAction(action, getScopeVariable),
    null,
    actions
  );
};

const processAction = (action, getScopeVariable) => {
  const args = evaluateArguments(action.variables, getScopeVariable);

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

const evaluateArguments = (args, getScopeVariable) => {
  const variableNames = keys(args);

  const argsList = variableNames.map((name) =>
    variable.evaluate(args[name], getScopeVariable)
  );

  return maybePromise(...argsList, (...items) => zipObj(variableNames, items));
};
