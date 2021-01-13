// should be similar to variable
// there might be multiple categories of a functions? [module]/[operation]/[redirect]
// in the suggestions user will see all functions of module, operations, or redirects for all pages
//
// How to do function call generic since we might also need to call functions in the loop or during dictionary creation. Should we combine variables and functions in one Value component? We might not need function action then. Will have "value" action which will let to either choose variable or function. Function will be highlighted as pink and value as blue. Get both suggestions(variable and funcs) in one dropdown. Function arguments will be appearing in the spreading area. Display "cog" icon in the right side of a function tag with count of arguments. When user click on it - spread the arguments area. Restrict using function calls in place of function arguments to avoid nesting.
//
// Some functions might be considered as side-effects(redirect) and could not be used in a "value" action, but in "effect" instead

import { zipObj } from "ramda";
import * as operation from "../../wires/operation";
import { maybePromise } from "../../utils";
import * as cache from "../cache";
import * as variable from "./variable";

export const evaluate = (definition, getLocal) => {
  const { id, args, references } = definition;
  const argsNames = args.map((arg) => arg.name);
  const argsValues = args.map((arg) => variable.evaluate(arg, getLocal));

  return maybePromise(argsValues, (items) => {
    const args = zipObj(argsNames, items);
    const cached = cache.get(id, args);
    const call = createFunction(definition, getLocal);

    if (cached) {
      return cached;
    }

    return maybePromise([call(args, references)], ([result]) => {
      cache.set(id, args, result);

      return result;
    });
  });
};

const spec = {
  operation: operation.execute,
};

/**
 * Creates a function out of it's definition object.
 */
const createFunction = ({ category, payload }, getLocal) =>
  category === "module"
    ? getLocal("function", payload.moduleId, payload.property)
    : spec[category];
