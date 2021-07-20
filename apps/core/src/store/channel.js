import { ReplaySubject, merge } from "rxjs";
import { distinctUntilChanged } from "rxjs/operators";

export default class Channel extends ReplaySubject {
  report() {
    this.next(FETCHING);
  }
}

export const FETCHING = Symbol();

/**
 * Merges the stream created with "compute" with channel with
 * messages of FETCHING.
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
