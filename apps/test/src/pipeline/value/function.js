// should be similar to variable
// there might be multiple categories of a functions? [module]/[operation]/[redirect]
// in the suggestions user will see all functions of module, operations, or redirects for all pages
//
// How to do function call generic since we might also need to call functions in the loop or during dictionary creation. Should we combine variables and functions in one Value component? We might not need function action then. Will have "value" action which will let to either choose variable or function. Function will be highlighted as pink and value as blue. Get both suggestions(variable and funcs) in one dropdown. Function arguments will be appearing in the spreading area. Display "cog" icon in the right side of a function tag with count of arguments. When user click on it - spread the arguments area. Restrict using function calls in place of function arguments to avoid nesting.
//
// Some functions might be considered as side-effects(redirect) and could not be used in a "value" action, but in "effect" instead

import { zipObj, keys, values } from "ramda";
import * as operation from "../../wires/operation";
import { maybePromise } from "../../utils";
import * as loader from "../loader";
import * as variable from "./variable";

export const evaluate = (definition, accessors, scope) => {
  const { id, args, references } = definition;
  const argsNames = keys(args);
  const argsValues = values(args).map((arg) =>
    variable.evaluate(arg.data, accessors, scope)
  );

  return maybePromise(argsValues, (items) => {
    const args = zipObj(argsNames, items);
    const call = createFunction(definition, accessors);

    return loader.load(id, call, args, references);
  });
};

const spec = {
  operation: operation.execute,
};

/**
 * Creates a function out of it's definition object.
 */
const createFunction = ({ category, payload, references }, accessors) =>
  category === "module"
    ? accessors.local("function", references.module.id, payload.property)
    : spec[category];
