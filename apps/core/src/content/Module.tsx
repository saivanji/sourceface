import { Suspense } from "react";
import { getModule, useSelector, ModuleProvider } from "../store";
import { stock as modulesStock } from "../modules";
import type { Module } from "../types";

type ModuleProps = {
  moduleId: Module["id"];
};

export default function ModuleElement({ moduleId }: ModuleProps) {
  const module = useSelector((state) => getModule(state, moduleId));
  const { Root } = modulesStock[module.type];

  // TODO: provide initialState and initialConfig

  return (
    <ModuleProvider moduleId={moduleId}>
      <div className="rounded-md border-2 border-dashed p-4 bg-white mb-3">
        <Suspense fallback={"Loading..."}>
          <Root />
        </Suspense>
      </div>
    </ModuleProvider>
  );
}
