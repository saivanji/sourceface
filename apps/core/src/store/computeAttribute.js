import { of, combineLatest } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import computeSetting from "./computeSetting";

/**
 * Computes specific module attribute.
 */
export default function computeAttribute(moduleId, key, { registry, stock }) {
  const module$ = registry.entities.modules[moduleId];

  return module$.pipe(
    switchMap((module) => {
      const { selector, settings, attributes, atoms } =
        stock[module.type].attributes[key];

      const settings$ = combineSafe(
        settings?.map((field) =>
          computeSetting(moduleId, field, { registry, stock })
        )
      );
      const attributes$ = combineSafe(
        attributes?.map((key) =>
          computeAttribute(moduleId, key, { registry, stock })
        )
      );
      const atoms$ = combineSafe(
        atoms?.map((key) => registry.atoms[moduleId][key])
      );

      return combineLatest([settings$, attributes$, atoms$]).pipe(
        map(([settings, attributes, atoms]) =>
          selector({ settings, attributes, atoms })
        )
      );
    })
  );
}

/**
 * Combines list with dependency streams into one stream which
 * emits array of dependency values. If nothing or empty array
 * supplied we emit empty array for the consistency.
 */
function combineSafe(items) {
  return items?.length ? combineLatest(items) : of([]);
}