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
import { NormalizedModule } from "./schema";

export const useSelector: TypedUseSelectorHook<State> = useSelectorUntyped;

// TODO: might provide "defaultValue" as a second argument
export function useSetting<M extends NormalizedModule>(
  field: keyof M["config"]
) {
  const store = useStore<State<M>>();
  const dispatch = useDispatch();
  const moduleId = useContext(moduleContext);

  /**
   * Making sure we use the hook only inside of a module.
   */
  if (moduleId === null) {
    throw new Error("useSetting hook should be called inside of a module");
  }

  const data = useSelectorUntyped((state: State<M>) =>
    getSettingData<M>(state, [moduleId, field])
  );

  // // TODO: make sure the requesting field is a Future
  // if (typeof data === "undefined") {
  //   const state = store.getState();
  //   const { entities, indexes } = state;
  //   const stageIds = getFieldStageIds(state, [moduleId, field]);

  //   const result = computeStages<M>(stageIds, indexes.values, entities, true);

  //   if (result instanceof Promise) {
  //     throw result.then((data) => {
  //       dispatch(
  //         computationsSlice.actions.populateSetting({ moduleId, field, data })
  //       );
  //     });
  //   }
  // }

  return data;
}
