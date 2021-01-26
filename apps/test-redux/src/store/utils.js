import { curry } from "ramda";
import * as reselect from "reselect";

export const wrapSelector = (selector) =>
  curry((param, state) => selector(state, param));

export const createSelector = (...args) =>
  wrapSelector(reselect.createSelector(...args));
