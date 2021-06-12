import { __, curry, sort } from "ramda";
import { evaluate as evaluateVariable } from "../../pipeline/variable";
import { stock as stagesStock } from "../../stages";

export const readSetting = ([moduleId, field], { get, set }, scope) => {
  const module = get(moduleFamily(moduleId));
  const { entities } = get(page);

  const stages = getStages(field, "default", module.stages, entities);

  if (stages.length) {
    try {
      return stages.reduce((acc, stage) => {
        const input = stage.values.reduce((acc, valueId) => {
          const value = entities.values[valueId];

          return { ...acc, [value.name]: value };
        }, {});

        const curriedEvaluate = curry(evaluate)({ get, set }, __, scope);

        return stagesStock[stage.type].execute(curriedEvaluate, input);
      }, null);
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

  return module.config?.[field];
};

const getStages = (field, sequenceName, stageIds, entities) => {
  const items = stageIds.reduce((acc, stageId) => {
    const stage = entities.stages[stageId];

    if (stage.group !== `${field}/${sequenceName}`) {
      return acc;
    }

    return [...acc, stage];
  }, []);

  return sort((a, b) => a.order - b.order, items);
};

const evaluate = ({ get, set }, value, scope) => {
  const data = transformValue(value);

  if (data.type === "variable") {
    return evaluateVariable(
      data,
      scope,
      curry(getLocal)({ get, set }),
      curry(getMount)({ get, set })
    );
  }

  if (data.type === "function") {
    const { id, category, args, references, payload } = data;

    if (category === "module") {
      const transition = (valueOrFn) =>
        // TODO: should not be in readable
        set?.(stateFamily(references.module.id), valueOrFn);

      const evaluatedArgs = evaluateArgs({ get, set }, args, scope);

      return get(localFunctionFamily([references.module.id, payload.property]))(
        transition
      )(evaluatedArgs);
    }

    // if (set) {
    //   return set(functionResultFamily(id));
    // }

    // TODO: in case "set" is provided, might use "set(functionResultFamily)" instead so
    // we can invalidate cache
    return get(functionResultFamily(id));
  }
};

const evaluateArgs = ({ get, set }, valueIds, scope) => {
  const { entities } = get(page);

  return valueIds.reduce((acc, valueId) => {
    const value = entities.values[valueId];

    return {
      ...acc,
      [value.name]: evaluate({ get, set }, value, scope),
    };
  }, {});
};

const getMount = ({ get }, moduleId) => {
  return get(settingFamily([moduleId, "@mount"]));
};

const getLocal = ({ get }, moduleId, key) => {
  return get(localVariableFamily([moduleId, key]));
};

/**
 * Indicates interruption of sequence pipeline.
 */
export class Break {
  constructor(reason) {
    this.reason = reason;
  }
}
