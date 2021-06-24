import { createContext } from "react";
import { Provider as ReduxProvider } from "react-redux";
import init from "../init";

export const stockContext = createContext(null);

export default function StoreProvider({ children, data, stock }) {
  // TODO: since "core" will be exported as a library, keep in mind behavior of
  // the store creation on parent component re-render.
  const store = init(data, stock);

  return (
    <stockContext.Provider value={stock}>
      <ReduxProvider store={store}>{children}</ReduxProvider>
    </stockContext.Provider>
  );
}
