import { createSlice } from "@reduxjs/toolkit";
import { assocMutable } from "../../utils";

const initialState = {};

export default createSlice({
  name: "computations/data",
  initialState,
  reducers: {
    populateSetting(state, action) {
      const { moduleId, field, data } = action.payload;

      assocMutable(state, [moduleId, field], data);
    },
  },
});
