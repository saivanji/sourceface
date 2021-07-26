import { useState, useRef, useEffect } from "react";
import { isNil } from "ramda";
import { PENDING } from "../../store";

/**
 * Incapsulates usage of rxjs in store.
 */
export default function useAsyncValue(stream) {
  const initialValue = useRef();
  const isSync = useRef(false);
  const shouldSuspend = useRef(false);
  const resolve = useRef(null);
  const [state, setState] = useState({ isPending: false });

  useSubscription(
    stream,
    (nextValue) => {
      /**
       * Catching first sync emission. It could be either PENDING or stream value.
       */
      if (!isSync.current) {
        /**
         * When first value is PENDING, we suspend component until next value will come.
         */
        if (nextValue === PENDING) {
          shouldSuspend.current = true;
          /**
           * Otherwise first value is data and we set it as initial value so it will appear
           * at the first render
           */
        } else {
          initialValue.current = nextValue;
        }

        isSync.current = true;

        return;
      }

      if (nextValue !== PENDING && shouldSuspend.current) {
        resolve.current();
        shouldSuspend.current = false;
        return;
      }

      if (nextValue === PENDING) {
        setState((value) => ({ ...value, isPending: true }));
        return;
      }

      setState({ isPending: false, value: nextValue });
    },
    () => {
      // TODO: handle errors
    }
  );

  useEffect(() => {
    if (!isNil(state.value) && !isNil(initialValue.current)) {
      /**
       * Not keeping initial value in memory when we have it in state.
       */
      initialValue.current = null;
    }
  }, [state, initialValue]);

  const suspension = useSuspension(shouldSuspend.current, resolve);

  if (shouldSuspend.current) {
    throw suspension;
  }

  const isPending = state.isPending || isNil(initialValue.current);

  return [state.value || initialValue.current, isPending];
}

/**
 * Subscribing to the stream as early as possible so we can return first emitted
 * sync value from the stream at the first render.
 */
function useSubscription(stream, onNext, onError) {
  const subscription = useRef(null);

  if (isNil(subscription.current)) {
    subscription.current = stream.subscribe(onNext, onError);
  }

  useEffect(() => {
    return () => {
      subscription.current?.unsubscribe();
    };
  }, []);
}

function useSuspension(shouldSuspend, _resolve) {
  const promise = useRef(null);

  if (isNil(promise.current) && shouldSuspend) {
    promise.current = new Promise((resolve) => {
      _resolve.current = resolve;
    });
  }

  return promise.current;
}
