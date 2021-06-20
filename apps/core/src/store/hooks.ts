import { useContext } from "react";
import {
  useStore,
  useSelector as useSelectorUntyped,
  TypedUseSelectorHook,
} from "react-redux";
import { moduleContext } from "./providers";
import { getSettingData, getFieldStageIds } from "./selectors";
import { computeStages } from "./utils";
import type { State } from "./reducers";

export const useSelector: TypedUseSelectorHook<State> = useSelectorUntyped;

// TODO: might provide "defaultValue" as a second argument
export function useSetting<T>(field: string) {
  const store = useStore<State>();
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
    // TODO: can that state be more fresh than the one in useSelector?
    const state = store.getState();
    const { entities, indexes } = state;
    const stageIds = getFieldStageIds(state, [moduleId, field]);

    // no need in global registry, no need in middleware

    // throw computeStages(stageIds, indexes, entities, true).then((data) => {
    //   // dispatch(update)
    // });
  }

  return data;
}
