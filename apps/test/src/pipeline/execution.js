import { stock as stagesStock } from "./stages";
import { maybePromise, reduce } from "../utils";

export const readLocal = (
  type,
  key,
  blueprint,
  config,
  state,
  transition,
  accessors
) => {
  const keys = {
    variable: "variables",
    function: "functions",
  };

  const setup = blueprint[keys[type]][key];

  const settings = maybePromise(
    setup.settings?.map((field) => readSetting(field, config, accessors))
  );

  const variables = maybePromise(
    setup.variables?.map((key) =>
      readLocal(
        "variable",
        key,
        blueprint,
        config,
        state,
        transition,
        accessors
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

export const readSetting = (field, config, accessors) => {
  const stages = accessors.stages(field);

  if (stages.length) {
    try {
      return reduce(
        (acc, stage) =>
          stagesStock[stage.type].execute(stage.values, accessors),
        null,
        stages
      );
    } catch (err) {
      /**
       * When pipeline is interrupted - returning that interruption as a result so
       * it can be handled if needed.
       */
      if (err instanceof Break) {
        return err;
      }

      throw err;
    }
  }

  return config?.[field];
};

/**
 * Indicates interruption of sequence pipeline.
 */
export class Break {
  constructor(reason) {
    this.reason = reason;
  }
}
