import { createSlice } from "@reduxjs/toolkit";
import settings from "./settings";
import attributes from "./attributes";

const initialState = {
  lastId: 0,
  items: {},
};

const isAssocAction = (action) =>
  action.type === settings.actions.assoc.type ||
  action.type === attributes.actions.assoc.type;

export default createSlice({
  name: "data",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(isAssocAction, (state, action) => {
      const { id, data } = action.payload;

      if (typeof data !== "undefined") {
        state.items[id] = data;
        state.lastId = id;
      }
    });
  },
});
