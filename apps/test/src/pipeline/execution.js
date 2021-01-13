import { stock as stagesStock } from "./stages";
import { maybePromise, reduce } from "../utils";

// TODO: readScope
export const readLocal = (
  type,
  key,
  blueprint,
  config,
  state,
  getSequence,
  getLocal,
  setState
) => {
  const keys = {
    variable: "variables",
    function: "functions",
  };

  const setup = blueprint[keys[type]][key];

  const settings = maybePromise(
    setup.settings?.map((field) =>
      readSetting(config?.[field], getSequence(field), getLocal)
    )
  );

  const variables = maybePromise(
    setup.variables?.map((key) =>
      readLocal(
        "variable",
        key,
        blueprint,
        config,
        state,
        getSequence,
        getLocal,
        setState
      )
    )
  );

  return maybePromise([settings, variables], ([settings, variables]) => {
    const dependencies = { settings, variables };

    if (type === "variable") {
      return setup.selector(state, dependencies);
    }

    if (type === "function") {
      return (args) => setup.call(args, state, setState, dependencies);
    }
  });
};

export const readSetting = (value, sequence, getLocal) => {
  if (sequence.length) {
    return reduce(
      (acc, stage) => stagesStock[stage.type].execute(stage.values, getLocal),
      null,
      sequence
    );
  }

  return value;
};

/**
 * Indicates interruption of sequence pipeline.
 */
export class Break {
  constructor(reason) {
    this.reason = reason;
  }
}
