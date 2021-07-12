import { useContext, Suspense } from "react";
import { useModuleIds, useModule } from "./hooks";
import { stockContext, ModuleProvider } from "./providers";

export default function Layout() {
  const moduleIds = useModuleIds();

  return moduleIds.map((moduleId) => (
    // TODO: pass Layout to the Module component so it can recursively render
    // other layouts
    <Module key={moduleId} moduleId={moduleId} />
  ));
}

function Module({ moduleId }) {
  const module = useModule(moduleId);
  const stock = useContext(stockContext);
  const { Root } = stock[module.type];

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
