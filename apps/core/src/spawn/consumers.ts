import { stock as modulesStock } from "../modules";
import { selectors, useSelector } from "../store";
import type { Module } from "../types";

export function useSettings(module: Module) {
  const { rootSettings } = modulesStock[module.type];
  let settings = [];

  for (let field in rootSettings) {
    /**
     * Since we define fields statically and have exactly the same amount on
     * every render, it is safe to call in a loop.
     */
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const settingData = useSelector((state) =>
      selectors.getSettingData(state, [module.id, field])
    );
    settings.push(settingData);
  }

  return settings;
}
