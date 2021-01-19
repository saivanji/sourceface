import { useContext, useRef, useEffect, useMemo } from "react";
import {
  useSetRecoilState,
  useRecoilValue,
  useRecoilValueLoadable,
} from "recoil";
import { context } from "./Provider.jsx";
import { moduleFamily, settingsFamily, localVariablesFamily, stagesFamily } from "../store";
import { stock as modulesStock } from "../modules";

export function useModuleId() {
  return useContext(context);
}

export function useModule() {
  const moduleId = useModuleId();
  // TODO: should we use useRecoilValueLoadable instead unless we go all in with Suspense? Since when
  // settings editing will be implemented changing module settings real time might cause global loader to be
  // triggered.
  const module = useRecoilValue(moduleFamily(moduleId));
  const blueprint = modulesStock[module.type];

  return { module, blueprint };
}

export function useSettings(keys) {
  const input = useInput(keys);
  const loadable = useRecoilValueLoadable(settingsFamily(input));

  return useLoadableStatus(loadable);
}

export function useSettingCallback(key) {
  const input = useInput([key]);
  const func = useSetRecoilState(settingsFamily(input));
  const stages = useRecoilValue(stagesFamily(input))

  if (stages.length === 0) {
    return undefined;
  }

  return func
}

export function useLocalVariables(keys) {
  const input = useInput(keys);
  const loadable = useRecoilValueLoadable(localVariablesFamily(input));

  return useLoadableStatus(loadable);
}

function useInput(keys) {
  const { module } = useModule();
  // TODO: what if "keys" will be provided as value from render function?
  return useMemo(() => [module.id, keys], [module.id, keys]);
}

function useLoadableStatus(loadable) {
  const prev = useRef(null);
  const value = loadable.valueMaybe();

  useEffect(() => {
    if (value) {
      prev.current = value;
    }
  }, [value]);

  return {
    isPristine: !prev.current && loadable.state === "loading",
    isLoading: loadable.state === "loading",
    data: loadable.state === "hasValue" ? loadable.contents : prev.current,
    error: loadable.state === "hasError" ? loadable.contents : null,
  };
}
