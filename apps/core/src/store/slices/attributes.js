import { createSlice } from "@reduxjs/toolkit";
import { set } from "../utils";

const initialState = {};

export default createSlice({
  name: "attributes",
  initialState,
  reducers: {
    populate(state, action) {
      const { moduleId, key, data } = action.payload;

      set(state, [moduleId, key], data);
    },
  },
});
