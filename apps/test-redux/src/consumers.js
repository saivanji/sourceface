import { createContext, useContext } from "react";
import { useSelector } from "react-redux";
import * as modulesStock from "./modules";
import { getModule } from "./store";

export const moduleContext = createContext(null);

export const useModuleId = () => {
  return useContext(moduleContext);
};

export const useModule = () => {
  const moduleId = useModuleId();
  const module = useSelector(getModule(moduleId));
  const blueprint = modulesStock[module.type];

  return { module, blueprint };
};
