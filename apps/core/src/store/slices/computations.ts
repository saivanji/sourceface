import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Module } from "../../types";

export type ComputationsState = {
  [moduleId: number]: {
    [field: string]: unknown;
  };
};

export type PopulateSettingPayload = {
  moduleId: Module["id"];
  field: string;
  data: unknown;
};

const initialState: ComputationsState = {};

export const computationsSlice = createSlice({
  name: "computations",
  initialState,
  reducers: {
    populateSetting(state, action: PayloadAction<PopulateSettingPayload>) {
      const { moduleId, field, data } = action.payload;

      state[moduleId][field] = data;
    },
  },
});
