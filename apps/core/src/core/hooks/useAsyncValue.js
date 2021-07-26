import { useState, useRef } from "react";
import { PENDING } from "../../store";

/**
 * Incapsulates usage of rxjs in store.
 */
export default function useAsyncValue(stream) {
  const shouldSuspend = useRef(false);
  const [state, setState] = useState(() => {
    let value;

    stream
      .subscribe((nextValue) => {
        if (nextValue !== PENDING) {
          value = nextValue;
        } else {
          shouldSuspend.current = true;
        }
      })
      .unsubscribe();

    return { value, isPending: !value };
  });

  if (shouldSuspend.current) {
    throw suspension(stream);
  }

  return state;
}

function suspension(stream) {
  return new Promise((resolve, reject) => {
    const subscription = stream.subscribe((value) => {
      if (value !== PENDING) {
        subscription.unsubscribe();
        resolve(value);
      }
    }, reject);
  });
}
