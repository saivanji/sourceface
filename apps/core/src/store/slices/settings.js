import { createSlice } from "@reduxjs/toolkit";
import { set } from "../utils";

const initialState = {};

export default createSlice({
  name: "settings",
  initialState,
  reducers: {
    populate(state, action) {
      const { moduleId, field, data } = action.payload;

      set(state, [moduleId, field], data);
    },
  },
});
