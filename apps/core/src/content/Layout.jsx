import { useSelector } from "react-redux";
import { getModuleIds } from "../store";
import Module from "./Module";

export default function Layout() {
  const moduleIds = useSelector(getModuleIds);

  return (
    <div className="p-4 flex flex-col items-center">
      {moduleIds.map((moduleId) => (
        // TODO: pass Layout to the Module component so it can recursively render
        // other layouts
        <Module key={moduleId} moduleId={moduleId} />
      ))}
    </div>
  );
}
