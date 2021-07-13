import { path, isNil, map as mapCollection } from "ramda";
import { of, throwError, combineLatest, from } from "rxjs";
import { switchMap, map } from "rxjs/operators";
import computeAttribute from "./computeAttribute";

/**
 * Computes requesting value.
 */
export default function computeValue(valueId, dependencies) {
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

      return compute(value, dependencies).pipe(selectPath);
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
function computeAttributeValue(value, dependencies) {
  const moduleId = value.references.modules.module;
  const { property } = value.payload;

  return computeAttribute(moduleId, property, dependencies);
}

/**
 * Computes future function value.
 */
function computeFutureValue(value, dependencies) {
  const { futures, registry } = dependencies;
  const { identify, execute } = futures[value.payload.kind];

  // TODO: restrict function calls
  return computeFunctionArgs(value.args, dependencies).pipe(
    switchMap((args) => {
      const identifier = identify(args, value.references);
      const existing$ = registry.futures[identifier];

      /**
       * Leveraging existing stream to not duplicate async future
       * requests.
       */
      if (!isNil(existing$)) {
        return existing$;
      }

      // TODO: consider having counters(as BehaviourSubject's) in the registry
      // which will be switchMapped to the stream below, so we can invalidate cache
      // this way. Apply "shareReplay(1)" as well.
      const future$ = from(
        execute(args, value.references).then((res) => res.data)
      );

      /**
       * Adding stream to the registry so it's result can be cached.
       */
      registry.futures[identifier] = future$;

      return future$;
    })
  );
}

/**
 * Computes function args object.
 */
function computeFunctionArgs(args, dependencies) {
  const argToValue = (valueId) => computeValue(valueId, dependencies);
  return args ? combineLatest(mapCollection(argToValue, args)) : of({});
}

const categories = {
  "variable/constant": computeConstantValue,
  "variable/attribute": computeAttributeValue,
  "function/future": computeFutureValue,
};
