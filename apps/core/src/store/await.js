import { Subject, merge } from "rxjs";
import { distinctUntilChanged } from "rxjs/operators";

// TODO: give a better name
// TODO: should it be BehaviorSubject instead?

export const WAITING = Symbol();

export function createWaitableStream(identifier, compute, dependencies) {
  const { registry } = dependencies;
  const wait$ = registry.waits.reveal(identifier);

  const dependenciesWithWait = {
    ...dependencies,
    wait: () => wait$.next(WAITING),
  };
  const stream$ = compute(dependenciesWithWait);

  return merge(stream$, wait$).pipe(distinctUntilChanged());
}
