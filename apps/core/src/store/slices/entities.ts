import { createSlice } from "@reduxjs/toolkit";
import type { Module, Stage, Value } from "../../types";
import type { NormalizedModule, NormalizedStage } from "../schema";

// TODO: split on separate entities
export type EntitiesState = {
  modules: Record<Module["id"], NormalizedModule>;
  stages: Record<Stage["id"], NormalizedStage>;
  values: Record<Value["id"], Value>;
};

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
