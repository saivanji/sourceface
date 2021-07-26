import { ReplaySubject, merge } from "rxjs";
import { distinctUntilChanged } from "rxjs/operators";

// TODO: rename to Signal?

export default class Channel extends ReplaySubject {
  report() {
    this.next(PENDING);
  }
}

export const PENDING = Symbol();

/**
 * Merges the stream created with "compute" with channel with
 * messages of PENDING.
 *
 * Also provides "report" function to the dependencies list so it
 * can be called whenever async process is started.
 */
export function provideChannel(identifier, compute, dependencies) {
  const { registry } = dependencies;

  const channel$ = registry.channels.retrieve(identifier);
  const stream$ = compute({ ...dependencies, report: () => channel$.report() });

  return merge(stream$, channel$).pipe(distinctUntilChanged());
}
