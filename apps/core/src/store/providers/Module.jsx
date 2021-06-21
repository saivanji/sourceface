import React, { createContext } from "react";
import type { Module } from "../../types";

type ModuleProviderProps = {
  children: React.ReactNode;
  moduleId: Module["id"];
};

export const moduleContext = createContext<null | Module["id"]>(null);

/**
 * Provider module needs to be wrapped in, so we have access to it's id.
 */
export default function ModuleProvider({
  children,
  moduleId,
}: ModuleProviderProps) {
  return (
    <moduleContext.Provider value={moduleId}>{children}</moduleContext.Provider>
  );
}
