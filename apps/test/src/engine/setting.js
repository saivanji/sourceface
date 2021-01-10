import { stock as stagesStock } from "./stages";
import { reduce } from "./utils";

export const readSetting = (value, sequence, getLocalVariable) => {
  if (sequence.length) {
    return reduce(
      (acc, stage) =>
        stagesStock[stage.type].execute(stage.values, getLocalVariable),
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
