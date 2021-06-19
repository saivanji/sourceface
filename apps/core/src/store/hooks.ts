import { useContext } from "react";
import {
  useSelector as useSelectorUntyped,
  TypedUseSelectorHook,
} from "react-redux";
import { moduleContext } from "./providers";
import type { State } from "./reducers";
import { getSettingData } from "./selectors";

export const useSelector: TypedUseSelectorHook<State> = useSelectorUntyped;

// TODO: might provide "defaultValue" as a second argument
export function useSetting<T>(field: string) {
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

  return data;
}
