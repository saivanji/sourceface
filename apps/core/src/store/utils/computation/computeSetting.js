import * as slices from "../../slices";
import {
  isSettingStale,
  getStageName,
  getSetting,
  getFieldStageIds,
} from "../../selectors";
import { reduceAsync, pipe } from "../common";
import { defaultOpts } from "./defaults";
import computeSingleStage from "./computeSingleStage";

/**
 * Compute specific setting for given stage ids.
 */
export default function computeSetting(moduleId, field, { deps, opts, scope }) {
  opts = defaultOpts(opts);

  /**
   * Returning cached data if it exists and not stale unless "forceComputation"
   * is specified.
   */
  const cached = getSetting(deps.state, [moduleId, field]);
  const isStale = isSettingStale(deps.state, [moduleId, field]);

  if (!opts.forceComputation && cached && !isStale) {
    return cached;
  }

  const stageIds = getFieldStageIds(deps.state, [moduleId, field]);
  let stages = {};

  return pipe(
    reduceAsync(
      (_, stageId) => {
        const nextScope = { ...scope, stages };

        return pipe(
          computeSingleStage(stageId, { deps, opts, scope: nextScope }),
          (data) => {
            /**
             * Adding stage result to the scope object.
             */
            const stageName = getStageName(deps.state, stageId);
            stages[stageName] = data;

            return data;
          }
        );
      },
      null,
      stageIds
    ),
    (data) => {
      /**
       * When not in pure mode and dispatch is supplied - populating settings
       * state with new data.
       */
      if (deps.dispatch && !opts.pure) {
        deps.dispatch(
          slices.settings.actions.populate({
            moduleId,
            field,
            data,
          })
        );
      }

      return data;
    }
  );
}
