import { stock as stagesStock } from "./stages";
import { reduce } from "../utils";

export const readLocal = (
  module,
  type,
  key,
  blueprint,
  transition,
  accessors
) => {
  const keys = {
    variable: "variables",
    function: "functions",
  };

  const setup = blueprint[keys[type]][key];

  const settings = accessors.settings(setup.settings || []);
  const variables = accessors.localVariables(setup.variables || []);
  // TODO: consider type(either variable or function) when accessing the state
  const state = accessors.state(key, blueprint);

  const dependencies = { state, settings, variables };

  if (type === "variable") {
    return setup.selector(dependencies);
  }

  if (type === "function") {
    return (args) => setup.call(args, state, transition, dependencies);
  }
};

export const readSetting = (field, config, accessors, scope) => {
  const stages = accessors.stages(field);

  if (stages.length) {
    try {
      return reduce(
        (acc, stage) =>
          stagesStock[stage.type].execute(stage.values, accessors, scope),
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
