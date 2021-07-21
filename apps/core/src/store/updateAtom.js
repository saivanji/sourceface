/**
 * Updates single atom value.
 */
export default function updateAtom(moduleId, key, nextValue, { registry }) {
  const atom$ = registry.atoms[moduleId][key];

  if (typeof nextValue === "function") {
    let prev;

    /**
     * Update is guaranteed to be sync since we subscribing on
     * BehaviourSubject.
     */
    // TODO: may be we can use "getValue" here
    atom$
      .subscribe((value) => {
        prev = value;
      })
      .unsubscribe();

    atom$.next(nextValue(prev));

    return;
  }

  atom$.next(nextValue);
}
