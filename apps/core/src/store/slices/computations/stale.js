import { createSlice } from "@reduxjs/toolkit";
import data from "./data";

const initialState = {};

export default createSlice({
  name: "computations/stale",
  initialState,
  reducers: {
    /**
     * Invalidates specific computation marking it as stale.
     */
    invalidate(state, action) {
      const { moduleId, field } = action.payload;

      if (!state[moduleId]) {
        state[moduleId] = {
          [field]: true,
        };
        return;
      }

      state[moduleId][field] = true;
    },
  },
  extraReducers: (builder) => {
    /**
     * When "populateSetting" is dispatched, we need to make its computation fresh so
     * components can get that data available.
     */
    builder.addCase(data.actions.populateSetting, (state, action) => {
      const { moduleId, field } = action.payload;

      delete state[moduleId]?.[field];
    });
  },
});
