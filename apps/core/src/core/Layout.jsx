import { useContext, Suspense } from "react";
import { useModuleIds, useModule } from "./hooks";
import { stockContext, moduleContext, ModuleProvider } from "./providers";

export default function Layout() {
  const parentId = useContext(moduleContext);
  const moduleIds = useModuleIds(parentId);

  return moduleIds.map((moduleId) => (
    <Module key={moduleId} moduleId={moduleId} />
  ));
}

function Module({ moduleId }) {
  const module = useModule(moduleId);
  const stock = useContext(stockContext);
  const { Root, Skeleton = () => "Loading..." } = stock[module.type];

  return (
    <ModuleProvider moduleId={moduleId}>
      <div className="rounded-md border-2 border-dashed p-4 bg-white mb-3">
        <Suspense fallback={<Skeleton />}>
          <Root />
        </Suspense>
      </div>
    </ModuleProvider>
  );
}
