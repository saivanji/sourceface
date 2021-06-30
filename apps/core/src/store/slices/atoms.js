import { createSlice } from "@reduxjs/toolkit";
import { set } from "../utils";

const initialState = {};

export default createSlice({
  name: "atoms",
  initialState,
  reducers: {
    update(state, action) {
      const { moduleId, key, nextValue } = action.payload;

      set(state, [moduleId, key], nextValue);
    },
    updateMany(state, action) {
      const { moduleId, fragment } = action.payload;

      for (let key in fragment) {
        const nextValue = fragment[key];
        set(state, [moduleId, key], nextValue);
      }
    },
  },
});
