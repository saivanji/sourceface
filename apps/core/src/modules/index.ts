import React from "react";
import { mapObjIndexed } from "ramda";

import * as text from "./text";

export const stock = mapObjIndexed((value, type) => ({ ...value, type }), {
  text,
});

export type Definition<S, IC> = {
  Root: React.Component<RootProps<S>>;
  rootSettings?: string[];
  initialConfig: IC;
};

export type RootProps<S = []> = {
  settings: S;
};
