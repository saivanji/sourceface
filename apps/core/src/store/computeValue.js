import { path, isNil, map as mapCollection } from "ramda";
import { of, throwError, combineLatest, from, tap } from "rxjs";
import { switchMap, map } from "rxjs/operators";
import stringify from "fast-json-stable-stringify";
import computeAttribute from "./computeAttribute";
import computeSetting from "./computeSetting";
import createMethod from "./createMethod";

// TODO: some values should be labeled as "callback", so they can be computed only
// for the "callback" setting type, such as "method" or "effect"
/**
 * Computes requesting value.
 */
export default function computeValue(valueId, scope, dependencies) {
  const { registry } = dependencies;
  const value$ = registry.entities.values[valueId];

  if (isNil(value$)) {
    /**
     * Using "throwError" helper to explicitly return a failed observable instead
     * of crashing the current function.
     */
    return throwError(new Error("Can not find value in registry"));
  }

  return value$.pipe(
    switchMap((value) => {
      const selectPath = map(path(value.path || []));
      const compute = categories[value.category];

      if (isNil(compute)) {
        throw new Error("Unrecognized value category");
      }

      return compute(value, scope, dependencies).pipe(selectPath);
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
function computeAttributeValue(value, scope, dependencies) {
  const moduleId = value.references.modules.module;
  const { property } = value.payload;

  return computeAttribute(moduleId, property, scope, dependencies);
}

/**
 * Computes input variable value.
 */
function computeInputValue(_value, scope) {
  return of(scope.input);
}

/**
 * Computes stage variable value.
 */
function computeStageValue(value, scope) {
  const { name } = value.payload;

  return of(scope.stages[name]);
}

/**
 * Computes mount variable value.
 */
function computeMountValue(value, scope, dependencies) {
  const moduleId = value.references.modules.module;

  return computeSetting(moduleId, "@mount", scope, dependencies);
}

/**
 * Computes future function value.
 */
function computeFutureValue(value, scope, dependencies) {
  const { kind, mode } = value.payload;
  const { futures, registry } = dependencies;
  const { execute, identify } = futures[kind];

  return computeFunctionArgs(value.args, scope, dependencies).pipe(
    switchMap((args) => {
      if (mode === "write") {
        return from(execute(args, value.references)).pipe(
          tap((res) => {
            if (res.stale?.length > 0) {
              /**
               * Invalidating stale futures.
               */
              for (let id of res.stale) {
                const cache = registry.futures.get(kind, id);
                cache?.invalidate();
              }
            }
          }),
          map((res) => res.data)
        );
      }

      if (mode === "read") {
        const id = identify(value.references);
        const key = stringify(args);
        const cache = registry.futures.retrieve(kind, id);

        return cache
          .getOr(key, () => execute(args, value.references))
          .pipe(map((res) => res.data));
      }

      throw new Error("Unrecognized future mode");
    })
  );
}

/**
 * Computes method function value.
 */
function computeMethodValue(value, scope, dependencies) {
  const { property } = value.payload;
  const moduleId = value.references.modules.module;
  const method = createMethod(moduleId, property, scope, dependencies);

  return computeFunctionArgs(value.args, scope, dependencies).pipe(
    switchMap(method)
  );
}

/**
 * Computes function args object.
 */
// TODO: restrict function calls
function computeFunctionArgs(args, scope, dependencies) {
  const argToValue = (valueId) => computeValue(valueId, scope, dependencies);
  return args ? combineLatest(mapCollection(argToValue, args)) : of({});
}

const categories = {
  "variable/constant": computeConstantValue,
  "variable/attribute": computeAttributeValue,
  "variable/input": computeInputValue,
  "variable/stage": computeStageValue,
  "variable/mount": computeMountValue,
  "function/future": computeFutureValue,
  "function/method": computeMethodValue,
};
