import { useContext } from "react";
import { storeContext } from "../providers";
import useValue from "./useValue";

export default function useModule(moduleId) {
  const store = useContext(storeContext);

  return useValue(store.data.module(moduleId));
}
