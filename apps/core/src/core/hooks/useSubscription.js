import { useObservableEagerState } from "observable-hooks";

/**
 * Incapsulates usage of rxjs in store.
 */
export default function useSubscription(stream) {
  return useObservableEagerState(stream);
}
