import { waitForAll } from "recoil";
import { stock as modulesStock } from "../modules";
import { stock as stagesStock } from "../stages";
import * as wires from "../wires";
import { evaluate } from "../pipeline/variable";
import * as loader from "../loader";
import {
  moduleFamily,
  stateFamily,
  stateFieldFamily,
  countersFamily,
  Break,
} from "./common";
import { page } from "./entities";
import { populateStages, populateValues, transformValue } from "./utils";

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
  let prevStages = {};

  for (let stage of stages) {
    const nextScope = { ...scope, stages: prevStages };
    const input = populateValues(stage.values, { entities });
    const evaluate = (value) =>
      processValue(value, entities, nextScope, getAsync, set);

    try {
      result = await stagesStock[stage.type].execute(evaluate, input, true);
      prevStages[stage.name] = result;
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

const processValue = async (value, entities, scope, getAsync, set) => {
  const data = transformValue(value);

  if (data.type === "variable") {
    return evaluate(
      data,
      scope,
      (moduleId, key) => getLocal(moduleId, key, scope, getAsync, set),
      (moduleId) => execSetting([moduleId, "@mount"], scope, getAsync, set)
    );
  }

  if (data.type === "function") {
    const { category, args, references, payload } = data;

    if (category === "module") {
      const evaluatedArgs = await populateValuesAsync(args, entities, (value) =>
        processValue(value, entities, scope, getAsync, set)
      );

      const transition = (valueOrFn) =>
        set?.(stateFamily(references.module.id), valueOrFn);

      const module = await getAsync(moduleFamily(references.module.id));
      const blueprint = modulesStock[module.type];
      const setup = blueprint.functions[payload.property];

      return setup.call(
        evaluatedArgs,
        transition,
        await createDependencies(module.id, setup, scope, getAsync, set)
      );
    }

    return await processWire(data, entities, scope, getAsync, set);
  }

  throw new Error("Unknown value data type");
};

const processWire = async (data, entities, scope, getAsync, set) => {
  const { id, category, args, references } = data;
  const { referenceType, select, execute, getStaleIds } = wires[category];

  const reference = select(references);
  const call = (args) => execute(reference, args);

  const evaluatedArgs = await populateValuesAsync(args, entities, (value) =>
    processValue(value, entities, scope, getAsync, set)
  );

  const result = await loader.load(id, call, evaluatedArgs);

  const staleIds = getStaleIds(reference);
  for (let staleId of staleIds) {
    set(countersFamily([staleId, referenceType]), (prev) => prev + 1);
  }

  return result;
};

const getLocal = async (moduleId, key, scope, getAsync, set) => {
  const module = await getAsync(moduleFamily(moduleId));
  const blueprint = modulesStock[module.type];
  const setup = blueprint.variables[key];

  return setup.selector(
    await createDependencies(moduleId, setup, scope, getAsync, set)
  );
};

const populateValuesAsync = async (items, entities, fn) => {
  const all = await Promise.all(
    items.map((valueId) => fn(entities.values[valueId]))
  );

  return all.reduce((acc, item, i) => {
    const value = entities.values[items[i]];

    return {
      ...acc,
      [value.name]: item,
    };
  }, {});
};

const createDependencies = async (moduleId, setup, scope, getAsync, set) => {
  const settings = await Promise.all(
    setup.settings?.map((field) =>
      execSetting([moduleId, field], scope, getAsync, set)
    ) || []
  );

  const variables = await Promise.all(
    setup.variables?.map((key) =>
      getLocal(moduleId, key, scope, getAsync, set)
    ) || []
  );

  const state = await getAsync(
    waitForAll(
      setup.state?.map((key) => stateFieldFamily([moduleId, key])) || []
    )
  );

  return {
    settings,
    variables,
    state,
  };
};
