import React from "react";
import { Break } from "../engine";

export const Root = ({ scope: [value], state: { error }, onStateChange }) => {
  return (
    <div>
      <input
        type="text"
        placeholder="Enter text"
        value={value}
        className={error ? "bg-red-200" : ""}
        onChange={(e) =>
          onStateChange((state) => ({
            ...state,
            error: null,
            value: e.target.value,
          }))
        }
      />
      {error && <div className="text-red-600 mt-1">{error}</div>}
    </div>
  );
};

Root.scope = ["value"];

export const initialState = {
  value: "",
  error: null,
};

export const scope = {
  value: {
    selector: (state) => state.value,
    type: "String",
  },
};

export const functions = {
  reveal: {
    call: (args, state, transition, { scope: [value] }) => {
      const regexp = /^.+$/;

      if (!regexp.test(value)) {
        const error = "Invalid";

        transition((state) => ({ ...state, error }));

        throw new Break(`Validation failed with "${error}" message`);
      }

      return value;
    },
    scope: ["value"],
    returns: "String",
    args: {
      foo: "String",
    },
  },
};
