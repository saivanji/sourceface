import { useContext } from "react";
import { storeContext } from "../providers";
import useSubscription from "./useSubscription";

export default function useModuleIds(parentId) {
  const store = useContext(storeContext);

  return useSubscription(store.data.modules(parentId));
}
