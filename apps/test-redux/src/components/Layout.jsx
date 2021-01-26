import React from "react";
import Module from "./Module";
import { useModuleId } from "../consumers";
import { makeGetModuleIds } from "../store";
import { usePrivateSelector } from "../hooks";

export default function Layout() {
  const parentId = useModuleId();
  const moduleIds = usePrivateSelector(makeGetModuleIds, parentId);

  return (
    <div className="p-4 flex flex-col items-center text-center">
      {moduleIds.map((moduleId) => (
        <Module key={moduleId} moduleId={moduleId} />
      ))}
    </div>
  );
}
