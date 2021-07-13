import { of } from "rxjs";
import { switchMap, shareReplay } from "rxjs/operators";
import { isNil } from "ramda";
import { set } from "./utils";
import computeValue from "./computeValue";

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

      return computeStages(stageIds, of(null), scope, dependencies);
    }),
    /**
     * Avoiding re-computation of the same setting
     */
    shareReplay(1)
  );

  set(registry, ["settings", moduleId, field], setting$);

  return setting$;
}

function computeStages(stageIds, prev, scope, dependencies) {
  if (stageIds.length === 0) {
    return prev;
  }

  const [head, ...tail] = stageIds;

  const current$ = computeStage(head, scope, dependencies);
  return computeStages(tail, current$, dependencies);
}

/**
 * Computes setting stage.
 */
function computeStage(stageId, scope, dependencies) {
  const { registry } = dependencies;
  const stage$ = registry.entities.stages[stageId];

  return stage$.pipe(
    switchMap((stage) => {
      if (stage.type === "value") {
        return computeValue(stage.values.root, scope, dependencies);
      }

      throw new Error("Unrecognized stage type");
    })
  );
}
