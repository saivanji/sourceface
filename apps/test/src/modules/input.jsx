import React from "react";
import { Break } from "../pipeline";

export const Root = ({
  variables: [value],
  state: { error },
  onStateChange,
}) => {
  console.log(error);

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

Root.variables = ["value"];

export const initialState = {
  value: "",
  error: null,
};

export const variables = {
  value: {
    selector: (state) => state.value,
    type: "String",
  },
};

// TODO: rename to "effects"
export const functions = {
  reveal: {
    call: (args, state, transition, { variables: [value] }) => {
      const regexp = /^.+$/;

      if (!regexp.test(value)) {
        const error = "Invalid";

        transition((state) => ({ ...state, error }));

        // throw new Break(`Validation failed with "${error}" message`);
      }

      return value;
    },
    variables: ["value"],
    types: {
      returns: "String",
      args: {
        foo: "String",
      },
    },
  },
};
