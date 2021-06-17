import {
  useSelector as useSelectorUntyped,
  TypedUseSelectorHook,
} from "react-redux";
import type { State } from "./reducers";

export const useSelector: TypedUseSelectorHook<State> = useSelectorUntyped;
