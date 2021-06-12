import { F } from "ramda";
import { selectorFamily, waitForAll } from "recoil";
import * as loader from "../loader";
import * as wires from "../wires";
import { evaluate } from "../pipeline/variable";
import { stock as stagesStock } from "../stages";
import { stock as modulesStock } from "../modules";
import { populateStages, populateValues, transformValue } from "./utils";
import {
  page,
  moduleFamily,
  countersFamily,
  stateFieldFamily,
  Break,
} from "./common";

export const settingFamily = selectorFamily({
  key: "setting",
  get:
    ([moduleId, field]) =>
    ({ get }) => {
      const module = get(moduleFamily(moduleId));
      const { entities } = get(page);

      const stages = populateStages(field, "default", module.stages, entities);

      if (stages.length) {
        try {
          return stages.reduce((acc, stage) => {
            const input = populateValues(stage.values, entities);
            const evaluate = (value) => get(valueFamily(value.id));

            return stagesStock[stage.type].execute(evaluate, input);
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
    },
});

export const valueFamily = selectorFamily({
  key: "value",
  get:
    (valueId) =>
    ({ get }) => {
      const { entities } = get(page);
      const data = transformValue(entities.values[valueId]);

      if (data.type === "variable") {
        const getMount = (moduleId) => {
          return get(settingFamily([moduleId, "@mount"]));
        };

        const getLocal = (moduleId, key) => {
          return get(localVariableFamily([moduleId, key]));
        };

        return evaluate(data, {}, getLocal, getMount);
      }

      if (data.type === "function") {
        const { id, category, args, references, payload } = data;

        if (category === "module") {
          const evaluatedArgs = populateValues(args, entities, (value) =>
            get(valueFamily(value.id))
          );

          const module = get(moduleFamily(references.module.id));
          const blueprint = modulesStock[module.type];
          const setup = blueprint.functions[payload.property];

          return setup.call(
            evaluatedArgs,
            F,
            createDependencies(get, module.id, setup)
          );
        }

        return get(wireFamily(id));
      }

      throw new Error("Unknown value data type");
    },
});

export const localVariableFamily = selectorFamily({
  key: "localVariable",
  get:
    ([moduleId, key]) =>
    ({ get }) => {
      const module = get(moduleFamily(moduleId));
      const blueprint = modulesStock[module.type];
      const setup = blueprint.variables[key];

      return setup.selector(createDependencies(get, moduleId, setup));
    },
});

export const wireFamily = selectorFamily({
  key: "wire",
  get:
    (valueId) =>
    ({ get }) => {
      const { entities } = get(page);
      const { id, category, args, references } = transformValue(
        entities.values[valueId]
      );

      const { referenceType, select, execute } = wires[category];

      const reference = select(references);
      const call = (args) => execute(reference, args);

      get(countersFamily([reference.id, referenceType]));

      const evaluatedArgs = populateValues(args, entities, (value) =>
        get(valueFamily(value.id))
      );

      return loader.load(id, call, evaluatedArgs);
    },
});

const createDependencies = (get, moduleId, setup) => {
  const settings = get(
    waitForAll(
      setup.settings?.map((field) => settingFamily([moduleId, field])) || []
    )
  );
  const variables = get(
    waitForAll(
      setup.variables?.map((key) => localVariableFamily([moduleId, key])) || []
    )
  );
  const state = get(
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
