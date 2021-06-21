import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Module, ValueOf } from "../../types";

export type ComputationsState<M extends Module = Module> = {
  [moduleId: number]: {
    [field in keyof M["config"]]?: ValueOf<M["config"]>;
  };
};

export type PopulateSettingPayload<M extends Module> = {
  moduleId: M["id"];
  field: keyof M["config"];
  data: ValueOf<M["config"]>;
};

const initialState: ComputationsState = {};

export const computationsSlice = createSlice({
  name: "computations",
  initialState,
  reducers: {
    populateSetting<M extends Module>(
      state: ComputationsState<M>,
      action: PayloadAction<PopulateSettingPayload<M>>
    ) {
      const { moduleId, field, data } = action.payload;

      state[moduleId][field] = data;
    },
  },
});
