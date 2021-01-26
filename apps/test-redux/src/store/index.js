import { createStore } from "redux";

export * from "./selectors";
export { usePrivateSelector } from "./hooks";

export default function create(initialState) {
  return createStore((state) => state, initialState);
}
