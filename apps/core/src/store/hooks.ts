import { useContext } from "react";
import {
  useStore,
  useDispatch,
  useSelector as useSelectorUntyped,
  TypedUseSelectorHook,
} from "react-redux";
import { moduleContext } from "./providers";
import { computationsSlice } from "./slices";
import { getSettingData, getFieldStageIds } from "./selectors";
import { computeStages } from "./utils";
import type { State } from "./init";

export const useSelector: TypedUseSelectorHook<State> = useSelectorUntyped;

// TODO: might provide "defaultValue" as a second argument
export function useSetting<T>(field: string) {
  const store = useStore<State>();
  const dispatch = useDispatch();
  const moduleId = useContext(moduleContext);

  /**
   * Making sure we use the hook only inside of a module.
   */
  if (moduleId === null) {
    throw new Error("useSetting hook should be called inside of a module");
  }

  const data = useSelector((state) =>
    getSettingData<T>(state, [moduleId, field])
  );

  // TODO: make sure the requesting field is a Future
  if (typeof data === "undefined") {
    const state = store.getState();
    const { entities, indexes } = state;
    const stageIds = getFieldStageIds(state, [moduleId, field]);

    const result = computeStages<T>(stageIds, indexes.values, entities, true);

    if (result instanceof Promise) {
      throw result.then((data) => {
        dispatch(
          computationsSlice.actions.populateSetting({ moduleId, field, data })
        );
      });
    }
  }

  return data;
}
