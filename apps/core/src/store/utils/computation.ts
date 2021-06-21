import { mapObjIndexed, path } from "ramda";
import * as futures from "../futures";
import { mapObj } from "./common";
import type { Stage, Value } from "../../types";
import type {
  EntitiesState,
  StageIndexState,
  ValueIndexState,
  NormalizedStage,
} from "../slices";

/**
 * Computes settings of all modules groupped by module id and field.
 */
export function computeSettings<V>(
  stageIndex: StageIndexState,
  valueIndex: ValueIndexState,
  entities: EntitiesState
) {
  return mapObjIndexed(
    (stagesByField) =>
      mapObjIndexed(
        (stageIds) => computeStages<V>(stageIds, valueIndex, entities),
        stagesByField
      ),
    stageIndex
  );
}

/**
 * Compute specific setting for given stage ids.
 */
export function computeStages<V>(
  stageIds: Stage["id"][],
  valueIndex: ValueIndexState,
  entities: EntitiesState,
  isAsync = false
) {
  /**
   * We're wrapping "computeSingleStage" function because Typescript 4.2
   * do not support calling ReturnType on a function with a generic type arguments.
   */
  const wrapCompute = (stage: NormalizedStage) =>
    computeSingleStage<V>(stage, valueIndex, entities, isAsync);

  type Result = ReturnType<typeof wrapCompute> | null;

  return stageIds.reduce<Result>((_, stageId) => {
    const stage = entities.stages[stageId];
    return wrapCompute(stage);
  }, null);
}

/**
 * Computes specific stage data
 */
export function computeSingleStage<V>(
  stage: NormalizedStage,
  valueIndex: ValueIndexState,
  entities: EntitiesState,
  isAsync: boolean
) {
  // TODO: do we need value index, since we don't use it in selectors
  const stageValueIndex = valueIndex[stage.id];

  if (stage.type === "value") {
    const valueId = stageValueIndex["root"];

    return computeValue<V>(entities.values[valueId], isAsync);
  }

  if (stage.type === "dictionary") {
    return mapObj((valueId) => {
      const value = entities.values[valueId];
      return computeValue<V>(value, isAsync);
    }, stageValueIndex);
  }
}

/**
 * Computes value data.
 */
export function computeValue<T>(value: Value, isAsync: boolean) {
  const p = value.path || [];

  if (value.category === "variable/constant") {
    const data = value.payload.value;
    return path<T>(p, data);
  }

  if (isAsync && value.category === "function/future") {
    const { execute } = futures[value.payload.kind];

    // TODO: pass down arguments
    return execute<unknown>(value.references, {} as any).then((response) => {
      // TODO: how to invalidate cache at that point?

      return path<T>(p, response.data);
    });
  }

  // function/future, for operations and other async things
  // function/effect - for displaying notifications, making redirects doing other stuff
  // both future and effect are not applicable for the preload computation
  // TODO: should module function type be part of effect?
}
