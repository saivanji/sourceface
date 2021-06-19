import { mapObjIndexed, sort, path, values } from "ramda";
import type { Module, Stage, Value } from "../types";
import type {
  NormalizedModule,
  NormalizedStage,
  Entities,
  Indexes,
} from "./reducers";

type StageIds = Stage["id"][];

/**
 * Makes indexes object for the stages, groupped by module id and field.
 */
export function createStageIndexes(entities: Entities) {
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
  entities: Entities
) {
  type Result = Indexes["stages"][Module["id"]];

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
export function sortStages(stageIds: StageIds, entities: Entities) {
  return sort((a, b) => {
    const left = entities.stages[a].order;
    const right = entities.stages[b].order;

    return left - right;
  }, stageIds);
}

/**
 * Makes indexes object for values, groupped by stage id and value name.
 */
export function createValueIndexes(entities: Entities) {
  return mapObjIndexed(
    (stage) => groupStageValues(stage, entities),
    entities.stages
  );
}

/**
 * Groups values of a specific stage by value name.
 */
export function groupStageValues(stage: NormalizedStage, entities: Entities) {
  return stage.values.reduce((acc, valueId) => {
    const value = entities.values[valueId];

    return {
      ...acc,
      [value.name]: value.id,
    };
  }, {});
}

export function computeStages(
  stageIds: StageIds,
  indexes: Indexes,
  entities: Entities
) {
  return stageIds.reduce<unknown>((_, stageId) => {
    const stage = entities.stages[stageId];

    return computeSingleStage(stage, indexes, entities);
  }, null);
}

export function computeSingleStage(
  stage: NormalizedStage,
  indexes: Indexes,
  entities: Entities
) {
  const valueIndex = indexes.values[stage.id];

  switch (stage.type) {
    case "value": {
      const valueId = valueIndex["root"];

      if (typeof valueId === "undefined") {
        throw new Error(
          "Can not find value with 'root' name for the 'value' stage"
        );
      }

      return computeValue(entities.values[valueId]);
    }
    case "dictionary": {
      return mapObjIndexed((valueId) => {
        const value = entities.values[valueId];
        return computeValue(value);
      }, valueIndex);
    }
    case "debug": {
      for (let valueId of values(valueIndex)) {
        const value = entities.values[valueId];
        const data = computeValue(value);

        console.log(
          `Field: ${stage.field}, Stage: ${stage.name}, Value: ${value.name} = ${data}`
        );
      }

      return;
    }
  }
}

export function computeValue(value: Value) {
  if (value.category === "variable/constant") {
    const data = value.payload.value;

    return path(value.path || [], data);
  }
}
