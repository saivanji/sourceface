import { schema, normalize as n } from "normalizr";
import type { Module, Stage, Value } from "../types";
import type { Override } from "../utils";

export type Entities = {
  modules: Record<Module["id"], NormalizedModule>;
  stages: Record<Stage["id"], NormalizedStage>;
  values: Record<Value["id"], Value>;
};

export type Result = Module["id"][];

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

/**
 * Normalizes nested modules data in the plain structure to be
 * convenient to work in state.
 */
export function normalize(modules: Module[]) {
  return n<never, Entities, Result>(modules, rootSchema);
}
