import { useContext } from "react";
import { storeContext } from "../providers";
import useSubscription from "./useSubscription";

export default function useModule(moduleId) {
  const store = useContext(storeContext);

  return useSubscription(store.data.module(moduleId));
}
