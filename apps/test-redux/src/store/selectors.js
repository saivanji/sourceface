import { sort } from "ramda";
import { createSelector } from "reselect";

/**
 * Entities
 */
export const getModuleEntities = (state) => state.entities.modules;

/**
 * Module
 */
export const getModule = (state, moduleId) => {
  const moduleEntities = getModuleEntities(state);

  return moduleEntities[moduleId];
};

/**
 * Settings
 */
export const makeGetSetting = () =>
  createSelector(
    (_, [, field]) => field,
    (state, [moduleId]) => getModule(state, moduleId),
    (state) => state.entities.stages,
    // TODO:
    // Note, when one of the dependencies change - selector will recalculate which
    // will might case the extra re-render
    //
    // When unrelated stages will be changed, "stageEntities" will be considered as changed as well
    // so it will cause extra computation and re-render
    //
    // Problems
    // Extra computation
    // Extra rendering
    // Cost of deep equality check
    (field, module, stageEntities) => {
      const stages = getStages(field, "default", module.stages, stageEntities);
    }
  );

export const makeGetModuleIds = () =>
  createSelector(
    (state) => state.modules,
    getModuleEntities,
    (_, parentId) => parentId,
    (allModuleIds, moduleEntities, parentId) =>
      allModuleIds.filter((moduleId) => {
        const module = moduleEntities[moduleId];

        return module.parentId === parentId;
      })
  );

/**
 * Utils
 */
const getStages = (field, sequenceName, stageIds, stageEntities) => {
  const items = stageIds.reduce((acc, stageId) => {
    const stage = stageEntities[stageId];

    if (stage.group !== `${field}/${sequenceName}`) {
      return acc;
    }

    return [...acc, stage];
  }, []);

  return sort((a, b) => a.order - b.order, items);
};

const getVisibleTodos = createSelector(
  (state) => state.todos,
  (todos) => todos.filter((t) => t.visible)
);
