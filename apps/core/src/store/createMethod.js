import { of, from } from "rxjs";
import { switchMap } from "rxjs/operators";
import computeRequirements from "./computeRequirements";

/**
 * Creates a module method function, which when called will perform computation and
 * return a new stream.
 */
export default function createMethod(moduleId, key, scope, dependencies) {
  const { registry, stock } = dependencies;
  const module$ = registry.entities.modules[moduleId];

  return (args) => {
    return module$.pipe(
      switchMap((module) => {
        const { call, ...requirements } = stock[module.type].methods[key];

        return computeRequirements(
          moduleId,
          requirements,
          scope,
          dependencies
        ).pipe(
          switchMap(([settings, attributes, atoms]) => {
            const result = call(args, { settings, attributes, atoms });

            /**
             * "call" function can return Promise, so we're explicitly creating
             * new stream from the Promise.
             */
            if (result instanceof Promise) {
              return from(result);
            }

            return of(result);
          })
        );
      })
    );
  };
}
