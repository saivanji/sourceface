import React from "react";
import { Break } from "../pipeline";

export const Root = ({
  settings: [placeholder],
  variables: [value],
  state: { error, isRevealed },
  onStateChange,
}) => {
  const change = (e) => {
    const { value } = e.target;

    onStateChange((state) => ({
      ...state,
      error: !isRevealed ? null : validate(value),
      value,
    }));
  };

  return (
    <div>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        className={error ? "bg-red-200" : ""}
        onChange={change}
      />
      {error && <div className="text-red-600 mt-1">{error}</div>}
    </div>
  );
};

Root.settings = ["placeholder"];
Root.variables = ["value"];

export const initialState = {
  value: "",
  isRevealed: false,
  error: null,
};

export const initialConfig = {
  placeholder: "Enter text",
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
      transition((state) => ({ ...state, isRevealed: true }));

      const error = validate(value);

      if (error) {
        transition((state) => ({ ...state, error }));

        throw new Break(`Validation failed with "${error}" message`);
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

const regexp = /^.+$/;
const validate = (value) => {
  if (regexp.test(value)) {
    return null;
  }

  return "Invalid input";
};
