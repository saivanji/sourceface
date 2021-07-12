import { combineLatest } from "rxjs";
import computeSetting from "./computeSetting";
import computeAttribute from "./computeAttribute";
import createRegistry from "./createRegistry";

/**
 * Creates new store based on initial entities data and stock definition.
 */
export default function createStore(entities, stock, futures) {
  const registry = createRegistry(entities, stock);
  const dependencies = { registry, stock, futures };

  return {
    data: {
      setting(moduleId, field) {
        return computeSetting(moduleId, field, dependencies);
      },
      attribute(moduleId, key) {
        return computeAttribute(moduleId, key, dependencies);
      },
      atom(moduleId, key) {
        return registry.atoms[moduleId][key];
      },
      modules() {
        return registry.ids;
      },
      module(moduleId) {
        return registry.entities.modules[moduleId];
      },
    },
    // TODO: move both functions in a separate file
    actions: {
      updateAtom(moduleId, key, nextValue) {
        const atom$ = registry.atoms[moduleId][key];

        // if (typeof nextValue === "function") {
        //   /**
        //    * Update is guaranteed to be sync since we subscribing on
        //    * BehaviourSubject.
        //    */
        //   atom$.subscribe((prev) => {
        //     atom$.next(nextValue(prev));
        //   });

        //   return;
        // }

        atom$.next(nextValue);
      },
      // updateAtoms(moduleId, nextValues) {
      //   if (typeof nextValues === "function") {
      //     combineLatest(registry.atoms[moduleId]).subscribe((prevValues) => {
      //       this.updateAtoms(moduleId, nextValues(prevValues));
      //     });

      //     return;
      //   }

      //   for (let key of nextValues) {
      //     const nextValue = nextValues[key];
      //     registry.atoms[moduleId][key].next(nextValue);
      //   }
      // },
    },
  };
}
