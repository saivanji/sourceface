import { createSlice } from "@reduxjs/toolkit";
import settings from "./settings";

const initialState = {};

/**
 * State of stale async settings.
 */
export default createSlice({
  name: "stale",
  initialState,
  extraReducers: (builder) => {
    /**
     * When "populate" action is dispatched, we need to make its setting data fresh so
     * components can get that data available.
     */
    builder.addCase(settings.actions.populate, (state, action) => {
      const { moduleId, field } = action.payload;

      delete state[moduleId]?.[field];
    });
  },
});
