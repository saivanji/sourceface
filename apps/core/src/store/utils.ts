import { mapObjIndexed, sort, path, keys, zipObj } from "ramda";
import * as futures from "./futures";
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

/**
 * Computes settings of all modules groupped by module id and field.
 */
export function computeSettings(indexes: Indexes, entities: Entities) {
  return mapObjIndexed(
    (stagesByField) =>
      mapObjIndexed(
        (stageIds) => computeStages(stageIds, indexes, entities),
        stagesByField
      ),
    indexes.stages
  );
}

/**
 * Compute specific setting for given stage ids.
 */
export function computeStages(
  stageIds: StageIds,
  indexes: Indexes,
  entities: Entities,
  isAsync = false
) {
  return stageIds.reduce<unknown>((_, stageId) => {
    const stage = entities.stages[stageId];

    return computeSingleStage(stage, indexes, entities, isAsync);
  }, null);
}

/**
 * Computes specific stage data
 */
export function computeSingleStage(
  stage: NormalizedStage,
  indexes: Indexes,
  entities: Entities,
  isAsync: boolean
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

      return computeValue(entities.values[valueId], isAsync);
    }
    case "dictionary": {
      return mapObj((valueId) => {
        const value = entities.values[valueId];
        return computeValue(value, isAsync);
      }, valueIndex);
    }
    // TODO: probably should return result of a previous stage
    case "debug": {
      return mapObj(
        (valueId) => {
          const value = entities.values[valueId];
          return computeValue(value, isAsync);
        },
        valueIndex,
        (data) => {
          console.log(`Field: ${stage.field}, Stage: ${stage.name}, ${data}`);
        }
      );
    }
  }
}

/**
 * Computes value data.
 */
export function computeValue(value: Value, isAsync: boolean) {
  const p = value.path || [];

  if (value.category === "variable/constant") {
    const data = value.payload.value;

    return path(p, data);
  }

  if (isAsync && value.category === "function/future") {
    const { execute } = futures[value.payload.kind];

    // TODO: pass down arguments
    return execute<unknown>(value.references, {} as any).then((response) => {
      // TODO: how to invalidate cache at that point?

      return path(p, response.data);
    });
  }
  // function/future, for operations and other async things
  // function/effect - for displaying notifications, making redirects doing other stuff
  // both future and effect are not applicable for the preload computation
  // TODO: should module function type be part of effect?
}

/**
 * Maps object values by a provided function. Function can optionally return
 * a Promise.
 */
export function mapObj<I, O>(
  fn: (x: I) => O,
  obj: Record<string, I>,
  debug?: (x: O) => void
) {
  const fields = keys(obj);
  const out = fields.map((x) => fn(obj[x]));

  if (out[0] instanceof Promise) {
    return Promise.all(out).then((items) => zipRecord(fields, items, debug));
  }

  return zipRecord(fields, out, debug);
}

export function zipRecord<T>(
  keys: string[],
  values: T[],
  debug?: (x: T) => void
) {
  if (debug) {
    values.forEach(debug);
  }

  return zipObj(keys, values);
}
