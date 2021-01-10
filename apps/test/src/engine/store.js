import { selectorFamily } from "recoil";
import { sort } from "ramda";
import { denormalize } from "normalizr";
import { root, moduleFamily, stateFamily } from "../store";
import schema from "../schema";
import { stock as modulesStock } from "../modules";
import { readSetting } from "./setting";
import { readScopeVariable } from "./scope";
import { plural } from "./utils";

export const settingsFamily = selectorFamily({
  key: "settings",
  get: ([moduleId, fields]) => ({ get }) => {
    const module = get(moduleFamily(moduleId));

    return plural(fields, (field) => {
      const actions = get(actionsFamily([moduleId, field]));

      return readSetting(
        module.config?.[field],
        actions,
        getScopeVariable(get)
      );
    });
  },
});

export const scopeVariablesFamily = selectorFamily({
  key: "variable",
  get: ([moduleId, keys]) => ({ get }) => {
    const state = get(stateFamily(moduleId));
    const module = get(moduleFamily(moduleId));
    const blueprint = modulesStock[module.type];

    return plural(keys, (key) =>
      readScopeVariable(
        key,
        blueprint,
        module.config,
        state,
        getActions(moduleId, get),
        getScopeVariable(get)
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

const getScopeVariable = (get) => (moduleId, key) => {
  const state = get(stateFamily(moduleId));
  const module = get(moduleFamily(moduleId));
  const blueprint = modulesStock[module.type];

  return readScopeVariable(
    key,
    blueprint,
    module.config,
    state,
    getActions(moduleId, get),
    getScopeVariable(get)
  );
};

const getActions = (moduleId, get) => (field) =>
  get(actionsFamily([moduleId, field]));
