import { atom, atomFamily, selector, selectorFamily } from "recoil";
import { normalize } from "./schema";
import * as api from "./api";
import { plural, readSetting, readScopeValue } from "./engine/execution";
import { stock as modulesStock } from "./modules";

// TODO: rename to store/storage/source
export const moduleFamily = atomFamily({
  key: "module",
  default: selectorFamily({
    key: "module/default",
    get: (param) => ({ get }) => get(modules).entity[param]
  })
});

export const modules = selector({
  key: "modules",
  get: async () => normalize(await api.listModules())
});

export const selectedId = atom({
  key: "selectedId",
  default: selector({
    key: "selectedId/default",
    get: ({ get }) => get(modules).ids[0]
  })
});

export const settingsFamily = selectorFamily({
  key: "settings",
  get: ([moduleId, keys]) => ({ get }) => {
    const module = get(moduleFamily(moduleId));

    return plural(keys, (key) => readSetting(key, module, getScopeValue(get)));
  }
});

export const scopeFamily = selectorFamily({
  key: "scope",
  get: ([moduleId, keys]) => ({ get }) => {
    const state = get(stateFamily(moduleId));
    const module = get(moduleFamily(moduleId));
    const blueprint = modulesStock[module.type];

    return plural(keys, (key) =>
      readScopeValue(key, module, blueprint, state, getScopeValue(get))
    );
  }
});

export const stateFamily = atomFamily({
  key: "state",
  default: selectorFamily({
    key: "state/default",
    get: (param) => ({ get }) => {
      const module = get(moduleFamily(param));

      return modulesStock[module.type].initialState || {};
    }
  })
});

const getScopeValue = (get) => (moduleId, key) => {
  const state = get(stateFamily(moduleId));
  const module = get(moduleFamily(moduleId));
  const blueprint = modulesStock[module.type];

  return readScopeValue(key, module, blueprint, state);
};

// export const selected = selector({
//   key: "selected",
//   get: ({ get }) => get(moduleFamily(get(selectedId)))
// });
