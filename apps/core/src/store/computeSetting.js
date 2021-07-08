import { isNil } from "ramda";
import { of } from "rxjs";
import { switchMap } from "rxjs/operators";
import computeValue from "./computeValue";

/**
 * Computes specific module setting field.
 */
// TODO: where to assign resulting stream in the registry?
export default function computeSetting(moduleId, field, { registry, stock }) {
  const module$ = registry.entities.modules[moduleId];

  return module$.pipe(
    switchMap((module) => {
      const stageIds = module.fields?.[field];

      if (isNil(stageIds)) {
        const value = module?.config?.[field];
        const initialValue = stock[module.type].initialConfig?.[field];

        return of(value || initialValue);
      }

      return computeStages(stageIds, of(null), { registry, stock });
    })
  );
}

function computeStages(stageIds, prev, dependencies) {
  if (stageIds.length === 0) {
    return prev;
  }

  const [head, ...tail] = stageIds;

  const current$ = computeStage(head, dependencies);
  return computeStages(tail, current$, dependencies);
}

/**
 * Computes setting stage.
 */
function computeStage(stageId, { registry }) {
  const stage$ = registry.entities.stages[stageId];

  return stage$.pipe(
    switchMap((stage) => {
      if (stage.type === "value") {
        return computeValue(stage.values.root, { registry });
      }
    })
  );
}
