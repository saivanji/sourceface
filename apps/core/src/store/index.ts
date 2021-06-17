import { createStore } from "redux";
import { normalize } from "./schema";
import * as selectors from "./selectors";
import rootReducer from "./reducers";
import type { Module } from "../types";

function init(modules: Module[]) {
  const { result: moduleIds, entities } = normalize(modules);

  return createStore(rootReducer, { moduleIds, entities });
}

export default init;
export { selectors };
export * from "./hooks";
