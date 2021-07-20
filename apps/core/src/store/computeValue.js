import { path, isNil, map as mapCollection } from "ramda";
import { of, throwError, combineLatest, from, tap } from "rxjs";
import { switchMap, map, shareReplay } from "rxjs/operators";
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
  const { kind } = value.payload;
  const { futures, registry } = dependencies;
  const { execute, identify } = futures[kind];

  return computeFunctionArgs(value.args, scope, dependencies).pipe(
    switchMap((args) => {
      const id = identify(value.references);
      const argsStr = stringify(args);
      const cachePath = [kind, id, argsStr];

      // TODO: most likely cache and counters need to be merged into a single data structure
      // since they are similar.
      // const cache = registry.futures[kind].?[id]
      //
      // TODO: with timeout cache invalidation, we might have the case when existing data is displayed, became
      // stale and therefore deleted, new component rendered, fetched new data. So the new component will have
      // new data and old will have the previous version of the data. In that case we need to refetch all existing
      // data streams but without emitting "WAITING".
      // Alternatively have data as static completed stream and keep reference counting on cached data and clear cache only when it has no references.
      //
      // class Cache() {
      //   constructor() {
      //     this.version$ = new Counter();
      //     this.data = new Map();
      //     this.populations = new Map();
      //   }
      //
      //   // TODO: what if we invalidate in the middle of population?
      //   getOr(argsStr, populate, { start }) {
      //     return this.version$.pipe(
      //       switchMap(() => {
      //         const cached = this.data.get(argsStr);
      //
      //         if (!isNil(cached)) {
      //           return of(cached);
      //         }
      //
      //         // TODO: combine "this.populations" with "this.data" since they share the similar
      //         // concept? May be no, since we need to call "start()" only when data is populated
      //         // and not when cached. With having "populations" only, we have no way of knowing
      //         // either we currently executing or the data already cached.
      //         let populated$ = this.populations.get(argsStr)
      //
      //         if (isNil(populated$)) {
      //           p$ = from(populate()).pipe(
      //             tap(value => {
      //              this.populations.delete(argsStr)
      //
      //              // TODO: set invalidation timeout.
      //
      //               this.data.set(argsStr, value);
      //             }),
      //             shareReplay(1)
      //           );
      //
      //           this.populations.set(argsStr, populated$);
      //         }
      //
      //         start?.();
      //
      //         return populated$;
      //       })
      //     );
      //   }
      //
      //   invalidate() {
      //     this.data = new Map();
      //     this.version$.increment()
      //   }
      // }

      // TODO: that approach most likely will require loader implementation, since we don't
      // share the same future execution in that case.
      //
      // Can we resolve that in RxJS land? Save populate$ in cache, apply shareReplay and accept
      // extra function to getOr, like "onPopulate"? "wait$" logic can not be attached to populate$
      // since it will be shared across different setting computations.

      // if (value.mode === "write") {
      //   return from(execute(args, value.references)).pipe(
      //     tap(res => {
      //       if (res.stale) {
      //         /**
      //          * Invalidating stale futures.
      //          */
      //         for (let id of res.stale) {
      //           const cache = registry.futures[kind].?[id];
      //           cache.invalidate();
      //         }
      //       }
      //     }),
      //     map(res => res.data)
      //   );
      // }
      //
      // if (value.mode === "read") {
      //   TODO: should be side-effect free.
      //   return cache.getOr(argsStr, () => execute(args, value.references)).pipe(
      //     map(res => res.data)
      //   )
      // }
      //
      // throw new Error("Unrecofnized future mode")

      const counter$ = registry.counters.retrieve(kind, id);
      const cached = registry.futures.get(cachePath);

      return counter$.pipe(
        // tap(() => {}),
        switchMap(() => {
          if (!isNil(cached)) {
            return of(cached);
          }

          return from(
            execute(args, value.references).then((res) => {
              registry.futures.set(cachePath, res);
            })
          );
        }),
        // TODO: that part will be called multiple times after cache invalidation, which is undesired.
        // call that part of code only when executing(cache has no data).
        // have distinction between read and write futures.
        // read futures - leverage cache, have no invalidation.
        // write futures - do not use cache, have invalidations.
        map((res) => {
          if (res.stale) {
            /**
             * Invalidating stale futures.
             */
            for (let id of res.stale) {
              const counter$ = registry.counters.get(kind, id);
              counter$?.increment();
            }
          }

          return res.data;
        }),
        // TODO: is that needed here?
        shareReplay(1)
      );
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
