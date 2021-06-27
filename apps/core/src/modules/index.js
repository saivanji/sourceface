import { mapObjIndexed } from "ramda";

import * as button from "./button";
import * as counter from "./counter";
import * as input from "./input";
import * as text from "./text";

export const stock = mapObjIndexed((value, type) => ({ ...value, type }), {
  button,
  counter,
  input,
  text,
});
