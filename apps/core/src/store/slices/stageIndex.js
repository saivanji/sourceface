import { createSlice } from "@reduxjs/toolkit";
import type { Stage } from "../../types";

export type StageIndexState = {
  /**
   * "key" essentialy is a Module["id"]. Due to TS restriction, we can not
   * use type aliases as index signature parameters.
   */
  [moduleId: number]: {
    [field: string]: Stage["id"][];
  };
};

const initialState: StageIndexState = {};

export const stageIndexSlice = createSlice({
  name: "stageIndex",
  initialState,
  reducers: {},
});
