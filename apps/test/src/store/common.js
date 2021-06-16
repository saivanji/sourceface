import { mergeRight } from "ramda";
import { atom, atomFamily, selector, selectorFamily } from "recoil";
import { stock as modulesStock } from "../modules";
import { page, moduleEntityFamily } from "./entities";

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
// TODO: rename
export const moduleFamily = atomFamily({
  key: "module",
  default: selectorFamily({
    key: "module/default",
    get:
      (moduleId) =>
      ({ get }) => {
        const module = get(moduleEntityFamily(moduleId));
        const { initialConfig } = modulesStock[module.type];

        return mergeRight({ config: initialConfig }, module);
      },
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
    get:
      (moduleId) =>
      ({ get }) => {
        const module = get(moduleFamily(moduleId));

        return modulesStock[module.type].initialState || {};
      },
  }),
});

export const stateFieldFamily = selectorFamily({
  key: `stateField`,
  get:
    ([moduleId, key]) =>
    ({ get }) => {
      const state = get(stateFamily(moduleId));

      return state[key];
    },
});

export const countersFamily = atomFamily({
  key: "counters",
  default: 0,
});

/**
 * Modules list filtered by a parent module id
 */
export const modulesFamily = selectorFamily({
  key: "modules",
  get:
    (parentId) =>
    ({ get }) => {
      const { result } = get(page);

      return result.filter((moduleId) => {
        const module = get(moduleEntityFamily(moduleId));

        return module.parentId === parentId;
      });
    },
});

/**
 * Indicates interruption of sequence pipeline.
 */
export class Break {
  constructor(reason) {
    this.reason = reason;
  }
}
