import { getModulesEntities } from "../selectors";
import { ImpureComputation } from "../exceptions";
import { cleanMapObj } from "./common";
import { computeStages } from "./computation";

/**
 * Computes settings of all modules groupped by module id and field.
 */
export function populateComputations(state, stock) {
  const modules = getModulesEntities(state);

  return cleanMapObj(
    (module) =>
      cleanMapObj((stageIds) => {
        try {
          return computeStages(stageIds, state, stock, true);
        } catch (err) {
          /**
           * We do not expect impure function to be called when we perform
           * computation in pure mode.
           *
           * Returning "undefined" for the impure setting computation so it won't
           * get populated in the state. Therefore that computation will be performed
           * from the component.
           */
          if (err instanceof ImpureComputation) {
            return undefined;
          }

          throw err;
        }
      }, module.fields),
    modules
  );
}

/**
 * Populates modules state object with initial state from the stock.
 */
export function populateModulesState(stock, entities) {
  return cleanMapObj((module) => {
    return stock[module.type].initialState;
  }, entities.modules);
}

/**
 * Returns object of module state dependencies groupped by module id and state key.
 */
// TODO: test for cross state referencing
export function populateDependencies(stock, entities) {
  let result = {};

  for (let moduleId in entities.modules) {
    const module = entities.modules[moduleId];

    for (let field in module?.fields) {
      for (let stageId of module.fields[field]) {
        const stage = entities.stages[stageId];

        for (let valueName in stage.values) {
          const valueId = stage.values[valueName];
          const value = entities.values[valueId];

          // TODO: should we consider other categories?
          if (value.category !== "variable/module") {
            continue;
          }

          const refModuleId = value.references.modules.module;
          const refModule = entities.modules[refModuleId];

          const { state } = stock[refModule.type].variables.value;

          // TODO: go deeper to find cross referenced state?
          if (!state || state.length === 0) {
            continue;
          }

          for (let stateField of state) {
            // TODO: use mutable variant
            const x = result[refModuleId]?.[stateField]?.[moduleId];

            if (x) {
              x.push(field);
              continue;
            }

            // TODO: use mutable approach
            result = {
              ...result,
              [refModuleId]: {
                ...result[refModuleId],
                [stateField]: {
                  ...result[refModuleId]?.[stateField],
                  [moduleId]: [field],
                },
              },
            };
          }
        }
      }
    }
  }

  return result;
}
