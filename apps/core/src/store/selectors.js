import { createSelector } from "@reduxjs/toolkit";

const emptyList = [];

// TODO: what if computation will be performed at selectors level, with the help of indexes?

/**
 * Returns all module ids of the page.
 */
export const getModuleIds = (state) => state.ids;

/**
 * Returns object of all available modules
 */
export const getModulesEntities = (state) => state.entities.modules;

/**
 * Returns module by it's id.
 */
export const getModule = (state, moduleId) => {
  const modules = getModulesEntities(state);

  return modules[moduleId];
};

/**
 * Returns module type by it's id.
 */
export const getModuleType = (state, moduleId) => {
  const module = getModule(state, moduleId);
  return module.type;
};

/**
 * Returns stage by it's id
 */
export const getStage = (state, stageId) => state.entities.stages[stageId];

/**
 * Returns value by it's id
 */
export const getValue = (state, valueId) => state.entities.values[valueId];

export const getFieldStageIds = (state, [moduleId, field]) => {
  const module = getModule(state, moduleId);

  return module.fields?.[field] || emptyList;
};

/**
 * Returns calculated setting data for the specific module field.
 */
export const getSetting = (state, [moduleId, field]) => {
  const module = getModule(state, moduleId);
  const stages = getFieldStageIds(state, [moduleId, field]);

  /**
   * No stages for that field, using config value.
   */
  if (stages.length === 0) {
    return module.config[field];
  }

  return state.settings[moduleId]?.[field];
};

export const isSettingStale = (state, [moduleId, field]) =>
  state.stale[moduleId]?.[field];

export const eitherOneSettingStale = createSelector(
  (state, [moduleId]) => state.settings.stale[moduleId],
  (_, [, settings]) => settings,
  (stale, settings) => settings.some((field) => stale?.[field])
);

/**
 * Returns module atom value for the key.
 */
export const getAtom = (state, [moduleId, key]) => state.atoms[moduleId]?.[key];

/**
 * Returns the modules list, which depend on the module atom field.
 */
export const getAtomDependencies = (state, [moduleId, key]) =>
  state.dependencies[moduleId][key];

/**
 * Returns module attribute by it's key.
 */
export const getAttribute = (state, [moduleId, key]) =>
  state.attributes[moduleId]?.[key];
