import { createContext } from "react";

export const moduleContext = createContext(null);

/**
 * Provider module needs to be wrapped in, so we have access to it's id.
 */
export default function ModuleProvider({ children, moduleId }) {
  return (
    <moduleContext.Provider value={moduleId}>{children}</moduleContext.Provider>
  );
}
