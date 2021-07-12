import { of, combineLatest } from "rxjs";
import {
  map,
  switchMap,
  shareReplay,
  distinctUntilChanged,
} from "rxjs/operators";
import { isNil } from "ramda";
import { set } from "./utils";
import computeSetting from "./computeSetting";

/**
 * Computes specific module attribute.
 */
export default function computeAttribute(moduleId, key, dependencies) {
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
      const { selector, settings, attributes, atoms } =
        stock[module.type].attributes[key];

      const settings$ = combineSafe(
        settings?.map((field) => computeSetting(moduleId, field, dependencies))
      );
      const attributes$ = combineSafe(
        attributes?.map((key) => computeAttribute(moduleId, key, dependencies))
      );
      const atoms$ = combineSafe(
        atoms?.map((key) => registry.atoms[moduleId][key])
      );

      return combineLatest([settings$, attributes$, atoms$]).pipe(
        map(([settings, attributes, atoms]) =>
          selector({ settings, attributes, atoms })
        )
      );
    }),
    /**
     * Avoiding re-computation of the same attribute
     */
    shareReplay(1),
    /**
     * Avoiding emitting to the subscribers when next value
     * is the same as current.
     */
    distinctUntilChanged()
  );

  set(registry, ["attributes", moduleId, key], attribute$);

  return attribute$;
}

/**
 * Combines list with dependency streams into one stream which
 * emits array of dependency values. If nothing or empty array
 * supplied we emit empty array for the consistency.
 */
function combineSafe(items) {
  return items?.length ? combineLatest(items) : of([]);
}
