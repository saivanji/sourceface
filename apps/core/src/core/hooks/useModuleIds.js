import { useContext } from "react";
import { storeContext } from "../providers";
import useValue from "./useValue";

export default function useModuleIds(parentId) {
  const store = useContext(storeContext);

  return useValue(store.data.modules(parentId));
}
