import { selectorFamily } from "recoil";
import { moduleFamily, stateFamily, sequenceFamily } from "../store";
import { stock as modulesStock } from "../modules";
import { readSetting } from "./setting";
import { readLocal } from "./local";
import { plural } from "./utils";

// TODO: move to ../store
export const settingsFamily = selectorFamily({
  key: "settings",
  get: ([moduleId, fields]) => ({ get }) => {
    const module = get(moduleFamily(moduleId));

    return plural(fields, (field) => {
      const stages = get(sequenceFamily([moduleId, field]));

      return readSetting(module.config?.[field], stages, getLocal(get));
    });
  },
});

export const localVariablesFamily = selectorFamily({
  key: "variable",
  get: ([moduleId, keys]) => ({ get }) =>
    plural(keys, (key) => getLocal(get)("variable", moduleId, key)),
});

const getLocal = (get) => (type, moduleId, key) => {
  const state = get(stateFamily(moduleId));
  const module = get(moduleFamily(moduleId));
  const blueprint = modulesStock[module.type];

  return readLocal(
    type,
    key,
    blueprint,
    module.config,
    state,
    getSequence(moduleId, get),
    getLocal(get),
    (x) => x
  );
};

const getSequence = (moduleId, get) => (field) =>
  get(sequenceFamily([moduleId, field]));
