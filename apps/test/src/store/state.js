import { mergeRight } from "ramda";
import { atom, atomFamily, selector, selectorFamily } from "recoil";
import { normalize } from "normalizr";
import * as api from "./api";
import schema from "./schema";
import { getStages } from "./transformations";
import { maybePromise } from "../utils";
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
    get: (param) => ({ get }) => {
      const module = get(moduleFamily(param));

      return modulesStock[module.type].initialState || {};
    },
  }),
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

/**
 * Specific module settings based on it's id and desired setting fields.
 */
export const settingsFamily = selectorFamily({
  key: "settings",
  get: ([moduleId, fields]) => ({ get }) =>
    computeSettings(moduleId, fields, get),
  /**
   * Async set is not supported by Recoil see that issue for
   * the reference: https://github.com/facebookexperimental/Recoil/issues/762
   */
  set: ([moduleId, fields]) => ({ get, set }, args) =>
    computeSettings(moduleId, fields, get, set, { args }),
});

/**
 * Module local variables list based on it's id and desired variables keys.
 */
export const localVariablesFamily = selectorFamily({
  key: "variable",
  get: ([moduleId, keys]) => ({ get }) => {
    const accessors = createAccessors(moduleId, get);

    return maybePromise(
      keys.map((key) => accessors.local("variable", moduleId, key))
    );
  },
});

const createGetStage = (get) => (stageId) => get(stageFamily(stageId));

const createAccessors = (moduleId, get, set) => ({
  /**
   * Creator of a function returning a mount value of a specific module.
   */
  mount(moduleId) {
    const module = get(moduleFamily(moduleId));
    const accessors = createAccessors(moduleId, get, set);

    return readSetting("@mount", module.config, accessors);
  },
  /**
   * Accessor returning specific module stages based on a desired field.
   */
  stages(field) {
    return get(stagesFamily([moduleId, field]));
  },
  /**
   * Accessor returning local entity(either variable or function) based on
   * module id and entity key.
   */
  local(type, moduleId, key, scope) {
    const state = get(stateFamily(moduleId));
    const module = get(moduleFamily(moduleId));
    const blueprint = modulesStock[module.type];
    const transition = (valueOrFn) => set?.(stateFamily(moduleId), valueOrFn);
    const accessors = createAccessors(moduleId, get, set);

    return readLocal(
      type,
      key,
      blueprint,
      module.config,
      state,
      transition,
      accessors,
      scope
    );
  },
});

/**
 * Returns settings data based on module id and desired fields.
 */
const computeSettings = (moduleId, fields, get, set, scope) => {
  const module = get(moduleFamily(moduleId));

  return maybePromise(
    fields.map((field) => {
      const accessors = createAccessors(moduleId, get, set);

      return readSetting(field, module.config, accessors, scope);
    })
  );
};
