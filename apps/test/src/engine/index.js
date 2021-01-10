import { useRef, useEffect, useMemo } from "react";
import { useRecoilValueLoadable, useRecoilCallback } from "recoil";
import { useModule } from "../module";
import { settingsFamily, localVariablesFamily } from "./store";

export { Break } from "./setting";

export function useSettings(keys) {
  const input = useInput(keys);
  const loadable = useRecoilValueLoadable(settingsFamily(input));

  return useLoadableStatus(loadable);
}

export function useSettingCallback(key) {
  const input = useInput([key]);
  return useRecoilCallback(
    ({ snapshot }) => async () => {
      const [result] = await snapshot.getPromise(settingsFamily(input));

      return result;
    },
    [input]
  );
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
