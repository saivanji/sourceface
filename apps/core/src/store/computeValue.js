import { path, isNil } from "ramda";
import { of } from "rxjs";
import { switchMap, map } from "rxjs/operators";
import computeAttribute from "./computeAttribute";

/**
 * Computes requesting value.
 */
export default function computeValue(valueId, { registry, stock, futures }) {
  const value$ = registry.entities.values[valueId];

  if (isNil(value$)) {
    throw new Error("Can not find value in registry");
  }

  return value$.pipe(
    switchMap((value) => {
      const selectPath = map(path(value.path || []));

      if (value.category === "variable/constant") {
        return computeConstantValue(value).pipe(selectPath);
      }

      if (value.category === "variable/attribute") {
        return computeAttributeValue(value, { registry, stock }).pipe(
          selectPath
        );
      }

      throw new Error("Unrecognized value category");
    })
  );
}

/**
 * Computes constant variable value.
 */
function computeConstantValue(value) {
  return of(value.payload.value);
}

/**
 * Computes attribute variable value.
 */
function computeAttributeValue(value, { registry, stock }) {
  const moduleId = value.references.modules.module;
  const { property } = value.payload;

  return computeAttribute(moduleId, property, { registry, stock });
}
