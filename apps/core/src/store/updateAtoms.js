import { combineLatest } from "rxjs";

/**
 * Updates multiple atom values.
 */
export default function updateAtoms(moduleId, nextValues, dependencies) {
  const { registry } = dependencies;

  if (typeof nextValues === "function") {
    let prevValues;

    combineLatest(registry.atoms[moduleId])
      .subscribe((values) => {
        prevValues = values;
      })
      .unsubscribe();

    updateAtoms(moduleId, nextValues(prevValues), dependencies);

    return;
  }

  for (let key in nextValues) {
    const nextValue = nextValues[key];
    registry.atoms[moduleId][key].next(nextValue);
  }
}
