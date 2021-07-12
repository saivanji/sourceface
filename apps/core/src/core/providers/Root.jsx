import { createContext } from "react";
import { createStore } from "../../store";
import * as futures from "../futures";

export const storeContext = createContext(null);

export default function StoreProvider({ children, data, stock }) {
  // TODO: since "core" will be exported as a library, keep in mind behavior of
  // the store creation on parent component re-render.
  const store = createStore(data, stock, futures);

  return (
    <storeContext.Provider value={store}>{children}</storeContext.Provider>
  );
}
