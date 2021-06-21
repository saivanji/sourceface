import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

export const computationsSlice = createSlice({
  name: "computations",
  initialState,
  reducers: {
    populateSetting(state, action) {
      const { moduleId, field, data } = action.payload;

      state[moduleId][field] = data;
    },
  },
});
