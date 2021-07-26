import { useObservableEagerState } from "observable-hooks";

export default function useValue(stream) {
  return useObservableEagerState(stream);
}
