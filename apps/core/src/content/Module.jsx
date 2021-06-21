import { Suspense } from "react";
import { useSelector } from "react-redux";
import { getModule, ModuleProvider } from "../store";
import { stock as modulesStock } from "../modules";

export default function ModuleElement({ moduleId }) {
  const module = useSelector((state) => getModule(state, moduleId));
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
