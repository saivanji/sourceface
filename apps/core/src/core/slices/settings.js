import { createSlice } from "@reduxjs/toolkit";
import { set } from "../utils";

const initialState = {};

export default createSlice({
  name: "settings",
  initialState,
  reducers: {
    assoc(state, action) {
      const { id, info, path } = action.payload;

      set(state, [info.moduleId, info.field], { data: id, path });
    },
  },
});