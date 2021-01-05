import { selectorFamily } from "recoil";
import { sort } from "ramda";
import { denormalize } from "normalizr";
import { root, moduleFamily, stateFamily } from "../store";
import schema from "../schema";
import { stock as modulesStock } from "../modules";
import { readSetting } from "./setting";
import { readScopeValue } from "./scope";
import { plural } from "./utils";

export const settingsFamily = selectorFamily({
  key: "settings",
  get: ([moduleId, fields]) => ({ get }) => {
    const module = get(moduleFamily(moduleId));

    return plural(fields, (field) => {
      const actions = get(actionsFamily([moduleId, field]));

      return readSetting(module.config?.[field], actions, getScopeValue(get));
    });
  },
});

export const scopeFamily = selectorFamily({
  key: "scope",
  get: ([moduleId, keys]) => ({ get }) => {
    const state = get(stateFamily(moduleId));
    const module = get(moduleFamily(moduleId));
    const blueprint = modulesStock[module.type];

    return plural(keys, (key) =>
      readScopeValue(
        key,
        blueprint,
        module.config,
        state,
        getActions(moduleId, get),
        getScopeValue(get)
      )
    );
  },
});

export const actionsFamily = selectorFamily({
  key: "actions",
  get: ([moduleId, field]) => ({ get }) => {
    const { entities } = get(root);
    const module = entities.modules[moduleId];

    return sort(
      (a, b) => a.order - b.order,
      denormalize(module, schema[0], entities).actions.filter(
        (a) => a.field === field
      )
    );
  },
});

const getScopeValue = (get) => (moduleId, key) => {
  const state = get(stateFamily(moduleId));
  const module = get(moduleFamily(moduleId));
  const blueprint = modulesStock[module.type];

  return readScopeValue(
    key,
    blueprint,
    module.config,
    state,
    getActions(moduleId, get),
    getScopeValue(get)
  );
};

const getActions = (moduleId, get) => (field) =>
  get(actionsFamily([moduleId, field]));
