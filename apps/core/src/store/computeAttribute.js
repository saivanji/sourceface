import { map, switchMap, distinctUntilChanged } from "rxjs/operators";
import { isNil } from "ramda";
import { set } from "./utils";
import { shareLatest } from "./operators";
import computeRequirements from "./computeRequirements";

/**
 * Computes specific module attribute.
 */
export default function computeAttribute(moduleId, key, scope, dependencies) {
  const { registry, stock } = dependencies;
  const module$ = registry.entities.modules[moduleId];
  const existing$ = registry.attributes[moduleId]?.[key];

  /**
   * Leveraging existing stream from the registry
   */
  if (!isNil(existing$)) {
    return existing$;
  }

  const attribute$ = module$.pipe(
    switchMap((module) => {
      const { selector, ...requirements } = stock[module.type].attributes[key];

      return computeRequirements(
        moduleId,
        requirements,
        scope,
        dependencies
      ).pipe(
        map(([settings, attributes, atoms]) =>
          selector({ settings, attributes, atoms })
        )
      );
    }),
    /**
     * Avoiding re-computation of the same attribute
     */
    shareLatest(),
    /**
     * Avoiding emitting to the subscribers when next value
     * is the same as current.
     */
    distinctUntilChanged()
  );

  set(registry, ["attributes", moduleId, key], attribute$);

  return attribute$;
}
