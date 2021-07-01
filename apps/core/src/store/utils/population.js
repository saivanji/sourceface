import { pick } from "ramda";
import { getModulesEntities } from "../selectors";
import { ImpureComputation } from "../exceptions";
import { cleanMapObj, set } from "./common";
import { computeSetting, computeAttribute } from "./computation";

/**
 * Computes settings of all modules groupped by module id and field.
 */
export function populateSettings(stock, state) {
  const modules = getModulesEntities(state);

  return cleanMapObj(
    (module, moduleId) =>
      cleanMapObj((_, field) => {
        try {
          return computeSetting(
            moduleId,
            field,
            { state, stock },
            {
              pure: true,
              forceComputation: true,
            }
          );
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
 * Computes attributes of all modules groupped by module id and attribute key
 */
export function populateAttributes(stock, state) {
  const modules = getModulesEntities(state);

  return cleanMapObj(
    (module, moduleId) =>
      cleanMapObj((_, key) => {
        try {
          return computeAttribute(
            moduleId,
            key,
            { state, stock },
            {
              pure: true,
              forceComputation: true,
            }
          );
        } catch (err) {
          /**
           * Since we perform settings computations during computation of the
           * attribute, we need to ignore impure computations by the same reason.
           */
          if (err instanceof ImpureComputation) {
            return undefined;
          }

          throw err;
        }
      }, stock[module.type].attributes),
    modules
  );
}

/**
 * Merges modules config data with initial config from the definition.
 */
export function populateConfigs(stock, state) {
  const modules = getModulesEntities(state);

  return cleanMapObj((module) => {
    const { initialConfig } = stock[module.type];

    return {
      ...module,
      config: {
        ...initialConfig,
        ...module.config,
      },
    };
  }, modules);
}

/**
 * Populates modules atoms object with initial atoms from the stock.
 */
export function populateAtoms(stock, state) {
  return cleanMapObj((module) => {
    return stock[module.type].initialAtoms;
  }, state.entities.modules);
}

/**
 * Returns object of module atoms dependencies groupped by module id and atom key
 * and computed attributes.
 */
export function populateDependencies(stock, state) {
  const { entities } = state;

  let dependencies = {};

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

          const attributeKey = value.payload.property;

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
            stock[sourceModule.type].attributes[attributeKey];

          /**
           * Adding target module as a dependency of that atom.
           */
          if (atoms?.length > 0) {
            for (let key of atoms) {
              const prev =
                dependencies[sourceModuleId]?.[key]?.[targetModuleId];

              if (prev) {
                prev.push(field);
                continue;
              }

              set(dependencies, [sourceModuleId, key, targetModuleId], [field]);
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

  return dependencies;
}
