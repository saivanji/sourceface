import React, { createContext, useContext } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import Skeleton from "react-loading-skeleton";
import cx from "classnames";
import { moduleFamily, stateFamily, selectedId } from "./store";
import { stock as modulesStock } from "./modules";
import { useSettings, useScopeVariables } from "./engine";

const context = createContext(null);
const empty = [];

export function useModule() {
  const moduleId = useContext(context);
  const module = useRecoilValue(moduleFamily(moduleId));
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
  const [selection, setSelection] = useRecoilState(selectedId);
  const { module, blueprint } = useModule();
  const [state, changeState] = useRecoilState(stateFamily(module.id));

  const { Root } = blueprint;

  const settings = useSettings(Root.settings || empty);
  const variables = useScopeVariables(Root.variables || empty);

  const isPristine = settings.isPristine || variables.isPristine;
  const isLoading = settings.isLoading || variables.isLoading;
  const error = settings.error || variables.error;

  if (isPristine) {
    return <Skeleton width={200} height={80} className="mb-3" />;
  }

  if (error) {
    console.log(error);
    return JSON.stringify(error);
  }

  return (
    <div
      onClick={() => setSelection(module.id)}
      className={cx(
        "rounded-md border-2 border-dashed p-4 bg-white mb-3",
        isLoading && "opacity-75",
        selection === module.id ? "border-blue-500" : "border-green-300"
      )}
    >
      <Root
        state={state}
        onStateChange={changeState}
        settings={settings.data}
        variables={variables.data}
      />
    </div>
  );
}
