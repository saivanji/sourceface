import type { Module } from "../types";
import type { Result, Entities } from "./schema";

export type State = {
  moduleIds: Result;
  entities: Entities;
  computations: Record<Module["id"], Record<string, ComputationState>>;
};

export type ComputationState = {
  isLoading: boolean;
  data?: unknown;
  error?: string;
};

export default function rootReducer(
  state: State = {
    moduleIds: [],
    entities: { modules: {}, stages: {}, values: {} },
    computations: {},
  }
) {
  return state;
}
