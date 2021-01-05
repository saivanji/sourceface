import { atom, atomFamily, selector, selectorFamily } from "recoil";
import { normalize } from "normalizr";
import * as api from "./api";
import schema from "./schema";
import { stock as modulesStock } from "./modules";

export const root = selector({
  key: "root",
  get: async () => normalize(await api.listModules(), schema),
});

export const moduleFamily = atomFamily({
  key: "module",
  default: selectorFamily({
    key: "module/default",
    get: (param) => ({ get }) => get(root).entities.modules[param],
  }),
});

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

export const selectedId = atom({
  key: "selectedId",
  default: selector({
    key: "selectedId/default",
    get: ({ get }) => get(root).result[0],
  }),
});

// export const selected = selector({
//   key: "selected",
//   get: ({ get }) => get(moduleFamily(get(selectedId)))
// });
