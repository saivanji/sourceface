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
     * When "assoc" action is dispatched, we need to make its setting data fresh so
     * components can get that data available.
     */
    builder.addCase(settings.actions.assoc, (state, action) => {
      const { info } = action.payload;

      delete state[info.moduleId]?.[info.field];
    });
  },
});
