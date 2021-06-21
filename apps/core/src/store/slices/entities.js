import { createSlice } from "@reduxjs/toolkit";

// TODO: split on separate entities
const initialState = {
  modules: {},
  stages: {},
  values: {},
};

export const entitiesSlice = createSlice({
  name: "entities",
  initialState,
  reducers: {},
});
