import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

export default createSlice({
  name: "computations/data",
  initialState,
  reducers: {
    populateSetting(state, action) {
      const { moduleId, field, data } = action.payload;

      state[moduleId][field] = data;
    },
  },
});
