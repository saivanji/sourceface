import React from "react";
import { useTransition } from "../engine/hooks";
// import { Setting } from "../editor/settings";

export function Root({ scope: [formatted] }) {
  const changeCount = useTransition("value");

  return (
    <div className="flex flex-col items-center">
      <span className="mb-2">Current: {formatted}</span>
      <div className="grid grid-flow-col gap-2">
        <button
          className="px-2 border border-gray-400 bg-gray-200 shadow rounded"
          onClick={() => changeCount((value) => value - 1)}
        >
          -
        </button>
        <button
          className="px-2 border border-gray-400 bg-gray-200 shadow rounded"
          onClick={() => changeCount((value) => value + 1)}
        >
          +
        </button>
      </div>
    </div>
  );
}

Root.settings = ["postfix"];
Root.scope = ["formatted"];

// export function Settings() {
//   return (
//     <>
//       <Setting name="postfix" />
//     </>
//   );
// }

export const initialState = {
  value: 0,
};

export const scope = {
  formatted: (state, [postfix]) => `${state.value} ${postfix}`,
};

export const functions = {
  increment: (state, transition) => {
    transition("value", state.value + 1);
  },
  log: (state, transition, [postfix]) => {
    console.log(postfix);
  },
};

export const types = {
  formatted: "String",
};

export const dependencies = {
  scope: {
    formatted: ["postfix"],
  },
  functions: {
    log: ["postfix"],
  },
};
