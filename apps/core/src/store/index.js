// TODO: consider using share/shareReplay to avoid costful computation. We might not need loader in futures because of that
// TODO: consider using distinctUntilChanged operator to avoid emitting data
// if it's not changed
//
// TODO: use debounceTime(0) and distinctUntilChanged in computeSetting and computeAttribute
// TODO: spawn new thread in hook for subsequent recomputations
//
// TODO: will be moved to core
export default function createStore(data, stock) {
  let registry = {
    entities: {},
    atoms: {},
    settings: {},
    attributes: {},
  };
}
