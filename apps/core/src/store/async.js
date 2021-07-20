import { Subject, merge } from "rxjs";
import { distinctUntilChanged } from "rxjs/operators";

// TODO: give a better name

export const WAITING = Symbol();

// TODO: emit to the stream from the future, the similar way we do with counters.
// TODO: merge counters and waits in a single stream, since they both share similar
// conception.
export function createAsyncStream(identifier, compute, dependencies) {
  const { registry } = dependencies;

  const wait$ = registry.waits.retrieve(identifier);
  // TODO: the following approach of providing wait$ won't work since if the same future
  // is calculated in different settings, the first future calculation will be cached and appear
  // in second cached calculation which is wrong
  const stream$ = compute({ ...dependencies, wait$ });

  return merge(stream$, wait$).pipe(distinctUntilChanged());
}

// TODO: should it be BehaviorSubject instead?
// TODO: should we emit WAITING in the beginning of the stream if computation is async?
export class Wait extends Subject {
  emit() {
    this.next(WAITING);
  }
}
