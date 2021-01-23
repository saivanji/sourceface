import { mergeRight } from "ramda";
import { atom, atomFamily, selector, selectorFamily, waitForAll } from "recoil";
import { normalize } from "normalizr";
import * as api from "./api";
import schema from "./schema";
import { getStages } from "./transformations";
import { stock as modulesStock } from "../modules";
import { readLocal, readSetting } from "../pipeline";

/**
 * Selected module state. Used in editor to represent currently
 * selected module.
 */
export const selectedId = atom({
  key: "selectedId",
  default: selector({
    key: "selectedId/default",
    get: ({ get }) => get(page).result[0],
  }),
});

/**
 * Modules settings state. Used for real time module configuration in
 * editor.
 */
export const moduleFamily = atomFamily({
  key: "module",
  default: selectorFamily({
    key: "module/default",
    get: (moduleId) => ({ get }) => {
      const module = get(page).entities.modules[moduleId];
      const { initialConfig } = modulesStock[module.type];

      return mergeRight({ config: initialConfig }, module);
    },
  }),
});

/**
 * Stages state. Used for real time configuration in the editor.
 */
export const stageFamily = atomFamily({
  key: "stage",
  default: selectorFamily({
    key: "stage/default",
    get: (stageId) => ({ get }) => get(page).entities.stages[stageId],
  }),
});

/**
 * Modules local state for holding dynamic module data and keeping
 * other modules in sync with each other when state changes.
 */
export const stateFamily = atomFamily({
  key: "state",
  default: selectorFamily({
    key: "state/default",
    get: (moduleId) => ({ get }) => {
      const module = get(moduleFamily(moduleId));

      return modulesStock[module.type].initialState || {};
    },
  }),
});

const stateFieldFamily = selectorFamily({
  key: `stateField`,
  get: ([moduleId, key]) => ({ get }) => {
    const state = get(stateFamily(moduleId));

    return state[key];
  },
});

/**
 * Current page data including modules list and page information.
 */
export const page = selector({
  key: "page",
  get: async () => normalize(await api.listModules(), schema),
});

/**
 * Modules list filtered by a parent module id
 */
export const modulesFamily = selectorFamily({
  key: "modules",
  get: (parentId) => ({ get }) => {
    const { result, entities } = get(page);

    return result.filter(
      (moduleId) => entities.modules[moduleId].parentId === parentId
    );
  },
});

// TODO: might map the ids in the UI and have singular selector for every stage
/**
 * Pipelines based on specific module and it's setting field.
 */
export const stagesFamily = selectorFamily({
  key: "stages",
  get: ([moduleId, field, sequenceName = "default"]) => ({ get }) => {
    const module = get(moduleFamily(moduleId));

    return getStages(field, sequenceName, module.stages, createGetStage(get));
  },
});

export const settingFamily = selectorFamily({
  key: "setting",
  get: ([moduleId, field]) => ({ get }) => {
    const module = get(moduleFamily(moduleId));
    const accessors = createAccessors(moduleId, get);

    return readSetting(field, module.config, accessors);
  },
  set: ([moduleId, field]) => ({ get, set }, args) => {
    const module = get(moduleFamily(moduleId));
    const accessors = createAccessors(moduleId, get, set);

    return readSetting(field, module.config, accessors, { args });
  },
});

export const localVariableFamily = selectorFamily({
  key: "variable",
  get: ([moduleId, key]) => ({ get }) => {
    const accessors = createAccessors(moduleId, get);
    const module = get(moduleFamily(moduleId));
    const blueprint = modulesStock[module.type];

    return readLocal(module, "variable", key, blueprint, () => {}, accessors);
  },
});

const createGetStage = (get) => (stageId) => get(stageFamily(stageId));

const createAccessors = (moduleId, get, set) => ({
  /**
   * Accessor returning module stages based on a desired field.
   */
  stages(field) {
    return get(stagesFamily([moduleId, field]));
  },
  /**
   * Accessor of a specific state field.
   */
  state(key, blueprint) {
    return blueprint.variables?.[key].state?.map((key) =>
      get(stateFieldFamily([moduleId, key]))
    );
  },
  settings(fields) {
    return get(
      waitForAll(fields.map((field) => settingFamily([moduleId, field])))
    );
  },
  localVariables(keys) {
    return get(
      waitForAll(keys.map((key) => localVariableFamily([moduleId, key])))
    );
  },
  /**
   * Accessor of a mount value for a specific module.
   */
  mount(moduleId) {
    const module = get(moduleFamily(moduleId));
    const accessors = createAccessors(moduleId, get, set);

    return readSetting("@mount", module.config, accessors);
  },
  /**
   * Accessor returning local entity(either variable or function) based on
   * module id and entity key.
   */
  local(type, moduleId, key, scope) {
    const module = get(moduleFamily(moduleId));
    const blueprint = modulesStock[module.type];
    const transition = (valueOrFn) => set?.(stateFamily(moduleId), valueOrFn);
    const accessors = createAccessors(moduleId, get, set);

    return readLocal(
      module,
      type,
      key,
      blueprint,
      transition,
      accessors,
      scope
    );
  },
});
