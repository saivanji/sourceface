import { Suspense } from "react";
import { useModule, ModuleProvider } from "../core";
import * as modulesStock from "../modules";

export default function ModuleElement({ moduleId }) {
  const module = useModule(moduleId);
  const { Root } = modulesStock[module.type];

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
