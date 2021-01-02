import React, { createContext, useContext } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import Skeleton from "react-loading-skeleton";
import cx from "classnames";
import * as store from "./store";
import { stock as modulesStock } from "./modules";
import { useSettings, useScope } from "./engine/hooks";

const context = createContext(null);
const empty = [];

export function useModule() {
  const moduleId = useContext(context);
  const module = useRecoilValue(store.moduleFamily(moduleId));
  const blueprint = modulesStock[module.type];

  return { module, blueprint };
}

export default function ModuleProvider({ moduleId }) {
  return (
    <context.Provider value={moduleId}>
      <Module />
    </context.Provider>
  );
}

function Module() {
  const [selectedId, setSelectedId] = useRecoilState(store.selectedId);
  const { module, blueprint } = useModule();
  const state = useRecoilValue(store.stateFamily(module.id));

  const { Root } = blueprint;

  const settings = useSettings(Root.settings || empty);
  const scope = useScope(Root.scope || empty);

  const isPristine = settings.isPristine || scope.isPristine;
  const isLoading = settings.isLoading || scope.isLoading;
  const error = settings.error || scope.error;

  if (isPristine) {
    return <Skeleton width={200} height={80} className="mb-3" />;
  }

  if (error) {
    return JSON.stringify(error);
  }

  return (
    <div
      onClick={() => setSelectedId(module.id)}
      className={cx(
        "cursor-pointer rounded-md border-2 border-dashed p-4 bg-white mb-3",
        isLoading && "opacity-75",
        selectedId === module.id ? "border-blue-500" : "border-green-300"
      )}
    >
      <Root state={state} settings={settings.data} scope={scope.data} />
    </div>
  );
}
