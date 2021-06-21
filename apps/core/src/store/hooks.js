import { useContext, useCallback } from "react";
import { useStore, useDispatch, useSelector } from "react-redux";
import { moduleContext } from "./providers";
import { computationsSlice, modulesStateSlice } from "./slices";
import {
  getSettingData,
  getFieldStageIds,
  getModuleStateValue,
} from "./selectors";
import { computeStages } from "./utils";

// TODO: might provide "defaultValue" as a second argument
export function useSetting(field) {
  const store = useStore();
  const dispatch = useDispatch();
  const moduleId = useContext(moduleContext);

  /**
   * Making sure we use the hook only inside of a module.
   */
  if (moduleId === null) {
    throw new Error("useSetting hook should be called inside of a module");
  }

  const data = useSelector((state) => getSettingData(state, [moduleId, field]));

  //   // // TODO: make sure the requesting field is a Future
  //   if (typeof data === "undefined") {
  //     const state = store.getState();
  //     const { entities, indexes } = state;
  //     const stageIds = getFieldStageIds(state, [moduleId, field]);

  //     const result = computeStages(stageIds, indexes.values, entities, true);

  //     if (result instanceof Promise) {
  //       throw result.then((data) => {
  //         dispatch(
  //           computationsSlice.actions.populateSetting({ moduleId, field, data })
  //         );
  //       });
  //     }
  //   }

  return data;
}

/**
 * Returns module state value for a given key. To be used in module definitions.
 */
export function useStateValue(key) {
  const moduleId = useContext(moduleContext);
  const dispatch = useDispatch();

  const value = useSelector((state) =>
    getModuleStateValue(state, [moduleId, key])
  );

  const update = useCallback(
    (nextValue) => {
      dispatch(modulesStateSlice.actions.update({ moduleId, key, nextValue }));
    },
    [moduleId, key, dispatch]
  );

  return [value, update];
}
