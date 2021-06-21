import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

export const modulesStateSlice = createSlice({
  name: "modulesState",
  initialState,
  reducers: {
    update(state, action) {
      const { moduleId, key, nextValue } = action.payload;
      const prevValue = state[moduleId];

      /**
       * If module has no initial state defined, it might not have the record in state object.
       */
      if (typeof prevValue === "undefined") {
        state[moduleId] = { [key]: nextValue };
        return;
      }

      state[moduleId][key] = nextValue;
    },
  },
});
