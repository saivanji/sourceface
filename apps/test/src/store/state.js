import { atom, atomFamily, selector, selectorFamily } from "recoil";
import { normalize } from "normalizr";
import * as api from "./api";
import schema from "./schema";
import { getSequence } from "./transformations";
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
    get: (param) => ({ get }) => get(page).entities.modules[param],
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
 * Pipelines based on specific module and it's setting field.
 */
export const sequenceFamily = selectorFamily({
  key: "sequence",
  get: ([moduleId, field, sequenceName = "default"]) => ({ get }) => {
    const { entities } = get(page);
    const module = entities.modules[moduleId];

    return getSequence(field, sequenceName, module, entities);
  },
});

/**
 * Specific module settings based on it's id and desired setting fields.
 */
export const settingsFamily = selectorFamily({
  key: "settings",
  get: ([moduleId, fields]) => ({ get }) =>
    computeSettings(moduleId, fields, get),
  set: ([moduleId, fields]) => ({ get, set }) =>
    computeSettings(moduleId, fields, get, set),
});

/**
 * Module local variables list based on it's id and desired variables keys.
 */
export const localVariablesFamily = selectorFamily({
  key: "variable",
  get: ([moduleId, keys]) => ({ get }) =>
    maybePromise(
      keys.map((key) => createGetLocal(get)("variable", moduleId, key))
    ),
});

/**
 * Creator of a function returning local entity(either variable or function) based on
 * module id and entity key.
 */
const createGetLocal = (get, set) => (type, moduleId, key) => {
  const state = get(stateFamily(moduleId));
  const module = get(moduleFamily(moduleId));
  const blueprint = modulesStock[module.type];
  const transition = (valueOrFn) => set?.(stateFamily(moduleId), valueOrFn);

  return readLocal(
    type,
    key,
    blueprint,
    module.config,
    state,
    createGetSequence(moduleId, get),
    createGetLocal(get),
    transition
  );
};

/**
 * Creator of a function returning specific module sequence based on a desired field.
 */
const createGetSequence = (moduleId, get) => (field) =>
  get(sequenceFamily([moduleId, field]));

/**
 * Returns settings data based on module id and desired fields.
 */
const computeSettings = (moduleId, fields, get, set) => {
  const module = get(moduleFamily(moduleId));

  return maybePromise(
    fields.map((field) => {
      const stages = get(sequenceFamily([moduleId, field]));

      return readSetting(
        module.config?.[field],
        stages,
        createGetLocal(get, set)
      );
    })
  );
};
