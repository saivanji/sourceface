import { useRef, useEffect } from "react";
import { useRecoilValueLoadable, useSetRecoilState } from "recoil";
import { useModule } from "../module";
import * as store from "../store";

export function useSettings(keys) {
  const input = useInput(keys);
  const loadable = useRecoilValueLoadable(store.settingsFamily(input));

  return useLoadableStatus(loadable);
}

export function useScope(keys) {
  const input = useInput(keys);
  const loadable = useRecoilValueLoadable(store.scopeFamily(input));

  return useLoadableStatus(loadable);
}

export function useTransition(key) {
  const { module } = useModule();
  const setter = useSetRecoilState(store.stateFamily(module.id));

  return (value) =>
    setter((prevState) => ({
      ...prevState,
      [key]: typeof value === "function" ? value(prevState[key]) : value
    }));
}

function useInput(keys) {
  const { module } = useModule();
  return [module.id, keys];
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
    error: loadable.state === "hasError" ? loadable.contents : null
  };
}
