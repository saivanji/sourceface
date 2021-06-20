import { mapObjIndexed } from "ramda";

import * as counter from "./counter";
import * as text from "./text";

export const stock = mapObjIndexed((value, type) => ({ ...value, type }), {
  counter,
  text,
});
