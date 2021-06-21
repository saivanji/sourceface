import { createSlice } from "@reduxjs/toolkit";
import type { Module } from "../../types";

export type ModulesState = Module["id"][];

const initialState: ModulesState = [];

export const modulesSlice = createSlice({
  name: "modules",
  initialState,
  reducers: {},
});
