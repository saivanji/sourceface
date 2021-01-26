import { createStore } from "redux";

export * from "./selectors";

export default function create(initialState) {
  return createStore((state) => state, initialState);
}
