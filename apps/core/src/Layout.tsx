import { selectors, useSelector } from "./store";
import { Module } from "./spawn";

export default function Layout() {
  const moduleIds = useSelector(selectors.getModuleIds);

  return (
    <div className="p-4 flex flex-col items-center">
      {moduleIds.map((moduleId) => (
        <Module key={moduleId} moduleId={moduleId} />
      ))}
    </div>
  );
}
