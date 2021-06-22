import { mapObjIndexed, sort } from "ramda";

// TODO: pass state and use selectors instead

/**
 * Makes indexes object for the stages, groupped by module id and field.
 */
export function createStageIndex(entities) {
  return mapObjIndexed(
    (module) => groupModuleStages(module, entities),
    entities.modules
  );
}

/**
 * Groups stages of a specific module by field.
 */
export function groupModuleStages(module, entities) {
  const sortedStages = sortStages(module.stages, entities);

  return sortedStages.reduce((acc, stageId) => {
    const stage = entities.stages[stageId];
    const prev = acc[stage.field] || [];

    return {
      ...acc,
      [stage.field]: [...prev, stageId],
    };
  }, {});
}

/**
 * Sorts stages according to it's "order" field.
 */
export function sortStages(stageIds, entities) {
  return sort((a, b) => {
    const left = entities.stages[a].order;
    const right = entities.stages[b].order;

    return left - right;
  }, stageIds);
}

/**
 * Makes indexes object for values, groupped by stage id and value name.
 */
export function createValueIndex(entities) {
  return mapObjIndexed(
    (stage) => groupStageValues(stage, entities),
    entities.stages
  );
}

/**
 * Groups values of a specific stage by value name.
 */
export function groupStageValues(stage, entities) {
  return stage.values.reduce((acc, valueId) => {
    const value = entities.values[valueId];

    return {
      ...acc,
      [value.name]: value.id,
    };
  }, {});
}

export function populateModulesState(moduleIds, stock, entities) {
  return moduleIds.reduce((acc, moduleId) => {
    const module = entities.modules[moduleId];
    const { initialState } = stock[module.type];

    if (!initialState) {
      return acc;
    }

    return { ...acc, [moduleId]: initialState };
  }, {});
}
