import { mapObjIndexed, sort } from "ramda";
import type { Module, Stage } from "../../types";
import type {
  EntitiesState,
  StageIndexState,
  NormalizedStage,
  NormalizedModule,
} from "../slices";

/**
 * Makes indexes object for the stages, groupped by module id and field.
 */
export function createStageIndex(entities: EntitiesState) {
  return mapObjIndexed(
    (module) => groupModuleStages(module, entities),
    entities.modules
  );
}

/**
 * Groups stages of a specific module by field.
 */
export function groupModuleStages(
  module: NormalizedModule,
  entities: EntitiesState
) {
  type Result = StageIndexState[Module["id"]];

  const sortedStages = sortStages(module.stages, entities);

  return sortedStages.reduce<Result>((acc, stageId) => {
    const stage = entities.stages[stageId];
    const prev = acc[stage.field] || [];

    return {
      ...acc,
      [stage.field]: [...prev, stageId],
    };
  }, {});
}

/**
 * Sorts stages according to it's "order" field.
 */
export function sortStages(stageIds: Stage["id"][], entities: EntitiesState) {
  return sort((a, b) => {
    const left = entities.stages[a].order;
    const right = entities.stages[b].order;

    return left - right;
  }, stageIds);
}

/**
 * Makes indexes object for values, groupped by stage id and value name.
 */
export function createValueIndex(entities: EntitiesState) {
  return mapObjIndexed(
    (stage) => groupStageValues(stage, entities),
    entities.stages
  );
}

/**
 * Groups values of a specific stage by value name.
 */
export function groupStageValues(
  stage: NormalizedStage,
  entities: EntitiesState
) {
  return stage.values.reduce((acc, valueId) => {
    const value = entities.values[valueId];

    return {
      ...acc,
      [value.name]: value.id,
    };
  }, {});
}
