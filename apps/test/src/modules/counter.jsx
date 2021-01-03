import React from "react";
// import { Setting } from "../editor/settings";

// TODO: test counter as pagination for table
export function Root({ scope: [value], onStateChange }) {
  const changeCount = (fn) =>
    onStateChange((state) => ({ ...state, value: fn(state.value) }));

  return (
    <div className="flex flex-col items-center">
      <span className="mb-2">Current: {value}</span>
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

Root.scope = ["value"];

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
  value: {
    selector: (state) => state.value,
    type: "Number",
  },
};

export const functions = {
  increment: {
    call: (state, transition, { settings: [value] }) => {
      transition("value", value + 1);
    },
    settings: ["value"],
  },
};
