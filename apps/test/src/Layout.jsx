import React from "react";
import { useRecoilValue } from "recoil";
import Module, { useModuleId } from "./spawn";
import { modulesFamily } from "./store";

export default function Layout() {
  const parentId = useModuleId();
  const moduleIds = useRecoilValue(modulesFamily(parentId));

  return (
    <div className="p-4 flex flex-col items-center text-center">
      {moduleIds.map((moduleId) => (
        <Module key={moduleId} moduleId={moduleId} />
      ))}
    </div>
  );
}
