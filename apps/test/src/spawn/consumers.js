import { useContext, useRef, useEffect } from "react";
import {
  useSetRecoilState,
  useRecoilValue,
  useRecoilValueLoadable,
  waitForAll,
} from "recoil";
import { context } from "./Provider.jsx";
import { moduleFamily, settingFamily, localVariableFamily } from "../store";
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

export function useSettings(fields) {
  const { module } = useModule();
  const loadable = useRecoilValueLoadable(
    waitForAll(fields.map((field) => settingFamily([module.id, field])))
  );

  return useLoadableStatus(loadable);
}

export function useSettingCallback(field) {
  const { module } = useModule();
  const func = useSetRecoilState(settingFamily([module.id, field]));

  /**
   * Do not returning a function when no stages defined.
   */
  if (module.stages.length === 0) {
    return undefined;
  }

  return func;
}

export function useLocalVariables(keys) {
  const { module } = useModule();
  const loadable = useRecoilValueLoadable(
    waitForAll(keys.map((key) => localVariableFamily([module.id, key])))
  );

  return useLoadableStatus(loadable);
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
