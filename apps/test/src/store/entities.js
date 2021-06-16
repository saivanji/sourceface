import { selector, selectorFamily } from "recoil";
import { normalize } from "normalizr";
import * as api from "../api";
import schema from "../schema";

/**
 * Current page data including modules list and page information.
 */
export const page = selector({
  key: "page",
  get: async () => normalize(await api.listModules(), schema),
});

export const stageEntityFamily = selectorFamily({
  key: "stageEntity",
  get:
    (stageId) =>
    ({ get }) => {
      const { entities } = get(page);
      return entities.stages[stageId];
    },
});

export const valueEntityFamily = selectorFamily({
  key: "valueEntity",
  get:
    (valueId) =>
    ({ get }) => {
      const { entities } = get(page);
      return entities.values[valueId];
    },
});

export const moduleEntityFamily = selectorFamily({
  key: "moduleEntity",
  get:
    (moduleId) =>
    ({ get }) => {
      const { entities } = get(page);
      return entities.modules[moduleId];
    },
});
