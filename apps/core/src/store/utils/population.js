import { pick } from "ramda";
import { getModulesEntities } from "../selectors";
import { ImpureComputation } from "../exceptions";
import { cleanMapObj, set } from "./common";
import { computeStages } from "./computation";

/**
 * Computes settings of all modules groupped by module id and field.
 */
export function populateSettings(state, stock) {
  const modules = getModulesEntities(state);

  return cleanMapObj(
    (module, moduleId) =>
      cleanMapObj((_, field) => {
        try {
          return computeStages(moduleId, field, state, stock, true);
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

export function populateAttributes(state, stock) {}

/**
 * Populates modules atoms object with initial atoms from the stock.
 */
export function populateAtoms(stock, entities) {
  return cleanMapObj((module) => {
    return stock[module.type].initialAtoms;
  }, entities.modules);
}

/**
 * Returns object of module atoms dependencies groupped by module id and atom key.
 */
export function populateDependencies(stock, entities) {
  let result = {};

  /**
   * Looking for a atom dependency of a "targetModuleId" on the module atom
   * mentioned in the provided fields.
   */
  function iterateSettings(targetModuleId, fields) {
    for (let field in fields) {
      const stageIds = fields[field];

      for (let stageId of stageIds) {
        const stage = entities.stages[stageId];

        for (let valueName in stage.values) {
          const valueId = stage.values[valueName];
          const value = entities.values[valueId];

          /**
           * Ignoring other variables, since module atom could be accessed
           * only through a "variable/attribute" value.
           */
          if (value.category !== "variable/attribute") {
            continue;
          }

          /**
           * Accessing source module. That module potentially can have atom
           * other modules can depend on.
           *
           * "variable/attribute" value has it's module reference as "module" key
           * therefore accessing it accordingly.
           */
          const sourceModuleId = value.references.modules.module;
          const sourceModule = entities.modules[sourceModuleId];

          /**
           * Extracting atom and settings dependencies of a module variable
           * definition so we can add our target module to the dependencies list of
           * that module.
           */
          const { atoms, settings } =
            stock[sourceModule.type].variables[value.payload.property];

          /**
           * Adding target module as a dependency of that atom.
           */
          if (atoms?.length > 0) {
            for (let key of atoms) {
              const prev = result[sourceModuleId]?.[key]?.[targetModuleId];

              if (prev) {
                prev.push(field);
                continue;
              }

              set(result, [sourceModuleId, key, targetModuleId], [field]);
            }
          }

          /**
           * Recursively looking for a atom source in dependent settings of
           * a module variable
           */
          if (settings?.length > 0) {
            const fields = pick(settings, sourceModule.fields);
            iterateSettings(targetModuleId, fields);
          }
        }
      }
    }
  }

  /**
   * Going through all available modules to find out whether the current module
   * depends on a atom from another module.
   */
  for (let targetModuleId in entities.modules) {
    const fields = entities.modules[targetModuleId].fields;
    iterateSettings(targetModuleId, fields);
  }

  return result;
}
