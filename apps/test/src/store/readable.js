import { F } from "ramda";
import { selectorFamily, waitForAll } from "recoil";
import * as loader from "../loader";
import * as wires from "../wires";
import { evaluate } from "../pipeline/variable";
import { stock as stagesStock } from "../stages";
import { stock as modulesStock } from "../modules";
import {
  populateStages,
  populateValues,
  transformValue,
  getPrevStages,
} from "./utils";
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
          return stages.reduce(
            (_, stage) => get(stageFamily([module.id, field, stage.id])),
            null
          );
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

// TODO: stageDataFamily?
export const stageFamily = selectorFamily({
  key: "stage",
  get:
    ([moduleId, field, stageId]) =>
    ({ get }) => {
      const { entities } = get(page);
      const stage = entities.stages[stageId];

      const input = populateValues(stage.values, entities);
      const evaluate = (value) => get(valueFamily([moduleId, field, value.id]));

      return stagesStock[stage.type].execute(evaluate, input);
    },
});

// TODO: valueDataFamily?
export const valueFamily = selectorFamily({
  key: "value",
  get:
    ([moduleId, field, valueId]) =>
    ({ get }) => {
      const { entities } = get(page);
      const data = transformValue(entities.values[valueId]);
      const module = entities.modules[moduleId];
      const stages = populateStages(field, "default", module.stages, entities);

      const prevStages = getPrevStages(valueId, stages, entities, (stageId) =>
        get(stageFamily([moduleId, field, stageId]))
      );

      if (data.type === "variable") {
        const getMount = (moduleId) => {
          return get(settingFamily([moduleId, "@mount"]));
        };

        const getLocal = (moduleId, key) => {
          return get(localVariableFamily([moduleId, key]));
        };

        return evaluate(data, { stages: prevStages }, getLocal, getMount);
      }

      if (data.type === "function") {
        const { id, category, args, references, payload } = data;

        if (category === "module") {
          const evaluatedArgs = populateValues(args, entities, (value) =>
            get(valueFamily([moduleId, field, value.id]))
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

        return get(wireFamily([moduleId, field, id]));
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
    ([moduleId, field, valueId]) =>
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
        get(valueFamily([moduleId, field, value.id]))
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
