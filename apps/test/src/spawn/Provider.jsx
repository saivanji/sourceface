import React, { createContext } from "react";
import Module from "./Module";

export const context = createContext(null);

export default function ModuleProvider({ moduleId }) {
  return (
    <context.Provider value={moduleId}>
      <Module />
    </context.Provider>
  );
}
