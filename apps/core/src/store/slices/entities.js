import { createSlice } from "@reduxjs/toolkit";
import type { Module, Stage, Value, Override } from "../../types";

// TODO: split on separate entities
export type EntitiesState<M extends Module = Module> = {
  modules: Record<M["id"], NormalizedModule<M>>;
  stages: Record<Stage["id"], NormalizedStage>;
  values: Record<Value["id"], Value>;
};

export type NormalizedModule<M extends Module = Module> = Override<
  M,
  {
    stages: Stage["id"][];
  }
>;

export type NormalizedStage = Override<
  Stage,
  {
    values: Value["id"][];
  }
>;

const initialState: EntitiesState = {
  modules: {},
  stages: {},
  values: {},
};

export const entitiesSlice = createSlice({
  name: "entities",
  initialState,
  reducers: {},
});
