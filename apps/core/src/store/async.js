import { Subject, merge } from "rxjs";
import { distinctUntilChanged } from "rxjs/operators";

// TODO: give a better name

export const WAITING = Symbol();

export function createAsyncStream(identifier, compute, dependencies) {
  const { registry } = dependencies;

  const wait$ = registry.waits.retrieve(identifier);
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
