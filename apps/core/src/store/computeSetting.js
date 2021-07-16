import { of, combineLatest } from "rxjs";
import { map, switchMap, shareReplay, catchError } from "rxjs/operators";
import { isNil, map as mapCollection } from "ramda";
import { set } from "./utils";
import computeValue from "./computeValue";
import Interruption from "./interruption";

/**
 * Computes specific module setting field.
 */
export default function computeSetting(moduleId, field, scope, dependencies) {
  const { registry, stock } = dependencies;
  const module$ = registry.entities.modules[moduleId];
  const existing$ = registry.settings[moduleId]?.[field];

  /**
   * Leveraging existing stream from the registry
   */
  if (!isNil(existing$)) {
    return existing$;
  }

  const setting$ = module$.pipe(
    switchMap((module) => {
      const stageIds = module.fields?.[field];

      if (isNil(stageIds)) {
        const value = module?.config?.[field];
        const initialValue = stock[module.type].initialConfig?.[field];

        return of(value || initialValue);
      }

      return computeStages(stageIds, of({ prev: {} }), scope, dependencies);
    }),
    /**
     * Avoiding re-computation of the same setting
     */
    shareReplay(1)
  );

  set(registry, ["settings", moduleId, field], setting$);

  return setting$;
}

function computeStages(stageIds, acc$, scope, dependencies) {
  return acc$.pipe(
    switchMap((acc) => {
      if (stageIds.length === 0) {
        return of(acc.prev[acc.name]);
      }

      const [head, ...tail] = stageIds;

      const nextAcc$ = computeStage(head, acc, scope, dependencies);
      return computeStages(tail, nextAcc$, scope, dependencies);
    }),
    catchError((err) => {
      /**
       * Catching stage interruptions
       */
      if (err instanceof Interruption) {
        return of(err);
      }

      throw err;
    })
  );
}

/**
 * Computes setting stage and returns next acc.
 */
function computeStage(stageId, acc, scope, dependencies) {
  const { registry } = dependencies;
  const stage$ = registry.entities.stages[stageId];

  return stage$.pipe(
    switchMap((stage) => {
      const nextScope = { ...scope, stages: acc.prev };
      const compute = stages[stage.type];

      if (isNil(compute)) {
        throw new Error("Unrecognized stage type");
      }

      return compute(stage, nextScope, dependencies).pipe(
        map((data) => ({
          name: stage.name,
          prev: { ...acc.prev, [stage.name]: data },
        }))
      );
    })
  );
}

/**
 * Computes value stage type.
 */
function computeValueStage(stage, scope, dependencies) {
  return computeValue(stage.values.root, scope, dependencies);
}

/**
 * Computes dictionary stage type.
 */
function computeDictionaryStage(stage, scope, dependencies) {
  const dict = mapCollection(
    (valueId) => computeValue(valueId, scope, dependencies),
    stage.values
  );

  return combineLatest(dict);
}

const stages = {
  value: computeValueStage,
  dictionary: computeDictionaryStage,
};
