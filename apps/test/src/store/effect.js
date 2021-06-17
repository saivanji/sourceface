import { stock as stagesStock } from "../stages";
import { moduleFamily, Break } from "./common";
import { page } from "./entities";
import { populateStages, populateValues } from "./utils";
import { valueFamily } from "./readable";

// TODO: clicking "submit" takes a while. Maybe it doesn't leverages recoil's cache

// Since we're not calling functions on arguments, it's safe to use "valueFamily" when evaluating
// the value and rely on WireResult to invalidate cache.

// Because recoil's selector does not support performing async actions in "set", we have to
// replicate the whole flow in async function and use it in "useRecoilCallback" afterwards.
export const execSetting = async ([moduleId, field], scope, getAsync, set) => {
  const module = await getAsync(moduleFamily(moduleId));
  const { entities } = await getAsync(page);
  const stages = populateStages(field, "default", module.stages, { entities });

  if (!stages.length) {
    return module.config?.[field];
  }

  let result;

  for (let stage of stages) {
    const input = populateValues(stage.values, { entities });
    // TODO: how to provide "scope"?
    const evaluate = (value) =>
      getAsync(valueFamily([moduleId, field, value.id]));

    try {
      result = await stagesStock[stage.type].execute(evaluate, input, true);
    } catch (err) {
      /**
       * When pipeline is interrupted - returning that interruption as a result so
       * it can be handled if needed.
       */
      if (err instanceof Break) {
        return err;
      }

      throw err;
    }
  }

  return result;
};
