import { of, combineLatest } from "rxjs";
import computeSetting from "./computeSetting";
import computeAttribute from "./computeAttribute";

export default function computeRequirements(
  moduleId,
  { settings, attributes, atoms },
  scope,
  dependencies
) {
  const { registry } = dependencies;

  const settings$ = combineSafe(
    settings?.map((field) =>
      computeSetting(moduleId, field, scope, dependencies)
    )
  );
  const attributes$ = combineSafe(
    attributes?.map((key) =>
      computeAttribute(moduleId, key, scope, dependencies)
    )
  );
  const atoms$ = combineSafe(
    atoms?.map((key) => registry.atoms[moduleId][key])
  );

  return combineLatest([settings$, attributes$, atoms$]);
}

/**
 * Combines list with dependency streams into one stream which
 * emits array of dependency values. If nothing or empty array
 * supplied we emit empty array for the consistency.
 */
export function combineSafe(items) {
  return items?.length ? combineLatest(items) : of([]);
}
