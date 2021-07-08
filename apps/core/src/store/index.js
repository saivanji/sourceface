// TODO: consider using share/shareReplay to avoid costful computation
// TODO: consider using distinctUntilChanged operator to avoid emitting data
// if it's not changed
// TODO: consider using BehaviorSubject for atoms
//
// TODO: will be moved to core
export default function createStore(data, stock) {
  let registry = {
    entities: {},
    atoms: {},
    settings: {},
    properties: {},
  };
}
