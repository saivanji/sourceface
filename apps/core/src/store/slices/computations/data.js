import { createSlice } from "@reduxjs/toolkit";
import { set } from "../../utils";

const initialState = {};

export default createSlice({
  name: "computations/data",
  initialState,
  reducers: {
    populateSetting(state, action) {
      const { moduleId, field, data } = action.payload;

      set(state, [moduleId, field], data);
    },
  },
});
