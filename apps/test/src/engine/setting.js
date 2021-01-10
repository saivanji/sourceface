import { stock as stagesStock } from "./stages";
import { reduce } from "./utils";

// TODO: move to "./execution"
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
