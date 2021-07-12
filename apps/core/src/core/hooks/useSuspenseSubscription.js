import { firstValueFrom } from "rxjs";
import { useObservableEagerState } from "observable-hooks";

/**
 * Incapsulates usage of rxjs in store.
 */
export default function useSuspenseSubscription(stream) {
  try {
    return useObservableEagerState(stream);
  } catch (err) {
    throw firstValueFrom(stream);
  }
}
