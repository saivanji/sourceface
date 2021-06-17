import { selectors, useSelector } from "../store";
import { stock as modulesStock } from "../modules";
import { useSettings } from "./consumers";
import type { Module } from "../types";

type ModuleProps = {
  moduleId: Module["id"];
};

export default function ModuleElement({ moduleId }: ModuleProps) {
  const module = useSelector((state) => selectors.getModule(state, moduleId));
  const { Root } = modulesStock[module.type];

  const settings = useSettings(module);

  return (
    <div className="rounded-md border-2 border-dashed p-4 bg-white mb-3">
      <Root settings={settings} />
    </div>
  );
}
