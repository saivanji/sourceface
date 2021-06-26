import * as futures from "../futures";
import {
  getStage,
  getValue,
  getModule,
  getModuleStateValue,
  getSettingData,
  getFieldStageIds,
} from "../selectors";
import { ImpureComputation } from "../exceptions";
import { mapObjectAsync, reduceAsync, pathAsync, mapAsync } from "./common";

/**
 * Compute specific setting for given stage ids.
 */
export function computeStages(stageIds, state, stock, pure = false) {
  return reduceAsync(
    (_, stageId) => computeSingleStage(stageId, state, stock, pure),
    null,
    stageIds
  );
}

/**
 * Computes specific stage data
 */
export function computeSingleStage(stageId, state, stock, pure) {
  const stage = getStage(state, stageId);

  if (stage.type === "value") {
    const valueId = stage.values.root;
    return computeValue(valueId, state, stock, pure);
  }

  if (stage.type === "dictionary") {
    return mapObjectAsync((valueId) => {
      return computeValue(valueId, state, stock, pure);
    }, stage.values);
  }
}

/**
 * Computes value data.
 */
export function computeValue(valueId, state, stock, pure) {
  const value = getValue(state, valueId);
  const p = value.path || [];

  /**
   * Making sure we do not perform impure computations
   * in pure mode.
   */
  if (
    pure &&
    (value.category === "function/future" ||
      value.category === "function/effect")
  ) {
    throw new ImpureComputation();
  }

  if (value.category === "variable/constant") {
    const data = value.payload.value;
    return pathAsync(p, data);
  }

  if (value.category === "variable/module") {
    const { property } = value.payload;
    const moduleId = value.references.modules.module;
    const module = getModule(state, moduleId);
    const definition = stock[module.type].variables[property];
    const data = computeSelector(moduleId, definition, state, stock, pure);

    return pathAsync(p, data);
  }

  if (!pure && value.category === "function/future") {
    const { execute } = futures[value.payload.kind];

    // TODO: pass down arguments
    return execute(value.references, {}).then((response) => {
      // TODO: how to invalidate cache at that point?

      return pathAsync(p, response.data);
    });
  }

  // function/future, for operations and other async things
  // function/effect - for displaying notifications, making redirects doing other stuff
  // both future and effect are not applicable for the preload computation
  // TODO: should module function type be part of effect?
}

/**
 * Applies variable selector of a specific module. Computes dependent
 * settings if they're not found in state. When computation is async,
 * then function will return a Promise.
 */
export function computeSelector(moduleId, definition, state, stock, pure) {
  const { selector, settings = [], state: moduleState = [] } = definition;

  const resultSettings = mapAsync((field) => {
    const cached = getSettingData(state, [moduleId, field]);

    if (cached) {
      return cached;
    }

    const stageIds = getFieldStageIds(state, [moduleId, field]);

    return computeStages(stageIds, state, stock, pure);
  }, settings);

  const resultState = moduleState?.map((key) =>
    getModuleStateValue(state, [moduleId, key])
  );

  if (resultSettings instanceof Promise) {
    return resultSettings.then((resultSettings) =>
      selector({ settings: resultSettings, state: resultState })
    );
  }

  return selector({ settings: resultSettings, state: resultState });
}
