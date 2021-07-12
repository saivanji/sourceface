import { createContext } from "react";
import { createStore } from "../store";
import * as futures from "./futures";

export const moduleContext = createContext(null);
export const storeContext = createContext(null);
export const stockContext = createContext(null);

export function RootProvider({ children, data, stock }) {
  // TODO: since "core" will be exported as a library, keep in mind behavior of
  // the store creation on parent component re-render.
  const store = createStore(data, stock, futures);

  return (
    <stockContext.Provider value={stock}>
      <storeContext.Provider value={store}>{children}</storeContext.Provider>
    </stockContext.Provider>
  );
}

/**
 * Provider module needs to be wrapped in, so we have access to it's id.
 */
export function ModuleProvider({ children, moduleId }) {
  return (
    <moduleContext.Provider value={moduleId}>{children}</moduleContext.Provider>
  );
}
