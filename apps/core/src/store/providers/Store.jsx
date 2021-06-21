import { Provider as ReduxProvider } from "react-redux";
import init from "../init";
import type { Module } from "../../types";

type StoreProviderProps = {
  modules: Module[];
  children: React.ReactNode;
};

export default function StoreProvider({
  children,
  modules,
}: StoreProviderProps) {
  // TODO: since "core" will be exported as a library, keep in mind behavior of
  // the store creation on parent component re-render.
  const store = init(modules);

  return <ReduxProvider store={store}>{children}</ReduxProvider>;
}
