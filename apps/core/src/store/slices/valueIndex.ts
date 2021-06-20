import { createSlice } from "@reduxjs/toolkit";
import type { Value } from "../../types";

export type ValueIndexState = {
  [stageId: number]: {
    [name: string]: Value["id"];
  };
};

const initialState: ValueIndexState = {};

export const valueIndexSlice = createSlice({
  name: "valueIndex",
  initialState,
  reducers: {},
});
