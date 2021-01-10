import { selectorFamily } from "recoil";
import { moduleFamily, stateFamily, sequenceFamily } from "../store";
import { stock as modulesStock } from "../modules";
import { readSetting } from "./setting";
import { readLocalVariable } from "./local";
import { plural } from "./utils";

export const settingsFamily = selectorFamily({
  key: "settings",
  get: ([moduleId, fields]) => ({ get }) => {
    const module = get(moduleFamily(moduleId));

    return plural(fields, (field) => {
      const stages = get(sequenceFamily([moduleId, field, "default"]));

      return readSetting(module.config?.[field], stages, getLocalVariable(get));
    });
  },
});

export const localVariablesFamily = selectorFamily({
  key: "variable",
  get: ([moduleId, keys]) => ({ get }) => {
    const state = get(stateFamily(moduleId));
    const module = get(moduleFamily(moduleId));
    const blueprint = modulesStock[module.type];

    return plural(keys, (key) =>
      readLocalVariable(
        key,
        blueprint,
        module.config,
        state,
        getSequence(moduleId, get),
        getLocalVariable(get)
      )
    );
  },
});

const getLocalVariable = (get) => (moduleId, key) => {
  const state = get(stateFamily(moduleId));
  const module = get(moduleFamily(moduleId));
  const blueprint = modulesStock[module.type];

  return readLocalVariable(
    key,
    blueprint,
    module.config,
    state,
    getSequence(moduleId, get),
    getLocalVariable(get)
  );
};

const getSequence = (moduleId, get) => (field) =>
  get(sequenceFamily([moduleId, field]));
