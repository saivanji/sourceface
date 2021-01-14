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
  transition
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
        transition
      )
    )
  );

  return maybePromise([settings, variables], ([settings, variables]) => {
    const dependencies = { settings, variables };

    if (type === "variable") {
      return setup.selector(state, dependencies);
    }

    if (type === "function") {
      return (args) => setup.call(args, state, transition, dependencies);
    }
  });
};

export const readSetting = (value, sequence, getLocal) => {
  if (sequence.length) {
    try {
      return reduce(
        (acc, stage) => stagesStock[stage.type].execute(stage.values, getLocal),
        null,
        sequence
      );
    } catch (err) {
      /**
       * When pipeline in interrupted - returning that interruption as a result so
       * it can be handled if needed.
       */
      if (err instanceof Break) {
        return err;
      }

      throw err;
    }
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
