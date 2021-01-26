import { wrapSelector, createSelector } from "./utils";

/**
 * Entities
 */
export const getModuleEntities = (state) => state.entities.modules;
export const getAllModuleIds = (state) => state.modules;

/**
 * Module
 */
export const getModule = wrapSelector((state, moduleId) => {
  const moduleEntities = getModuleEntities(state);

  return moduleEntities[moduleId];
});

export const makeGetModuleIds = () =>
  createSelector(
    getAllModuleIds,
    getModuleEntities,
    (_, parentId) => parentId,
    (allModuleIds, moduleEntities, parentId) =>
      allModuleIds.filter((moduleId) => {
        const module = moduleEntities[moduleId];

        return module.parentId === parentId;
      })
  );
