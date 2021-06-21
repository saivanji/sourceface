import { Provider as ReduxProvider } from "react-redux";
import init from "../init";

export default function StoreProvider({ children, modules, stock }) {
  // TODO: since "core" will be exported as a library, keep in mind behavior of
  // the store creation on parent component re-render.
  const store = init(modules, stock);

  return <ReduxProvider store={store}>{children}</ReduxProvider>;
}
