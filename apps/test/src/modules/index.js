import { mapObjIndexed } from "ramda";

import * as button from "./button";
import * as container from "./container";
import * as counter from "./counter";
import * as input from "./input";
import * as modal from "./modal";
import * as table from "./table";
import * as text from "./text";

export const stock = mapObjIndexed((value, type) => ({ ...value, type }), {
  button,
  container,
  counter,
  input,
  modal,
  table,
  text,
});
