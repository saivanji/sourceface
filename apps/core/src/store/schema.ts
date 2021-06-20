import { schema } from "normalizr";
import type { Module, Stage, Value, Override } from "../types";

export type NormalizedModule = Override<
  Module,
  {
    stages: Stage["id"][];
  }
>;

export type NormalizedStage = Override<
  Stage,
  {
    values: Value["id"][];
  }
>;

const valueSchema = new schema.Entity("values");
const stageSchema = new schema.Entity("stages", {
  values: [valueSchema],
});
const moduleSchema = new schema.Entity("modules", {
  stages: [stageSchema],
});
const rootSchema = new schema.Array(moduleSchema);

export default rootSchema;
