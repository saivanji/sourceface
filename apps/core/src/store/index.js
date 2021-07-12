// TODO: consider testing library through a public interface and rename FakeRegistry to FakeData/FakeEntities
//
// As alternative solution, we might apply debounceTime(0) in the hook only when we subscribe
// to the next update and use raw compute* without debouncing when we need initial value.
// Alternatively, we can leave using debounceTime(0) and just leverage ReactDOM.unstable_batchedUpdates feature
//
// TODO: consider using share/shareReplay to avoid costful computation. We might not need loader in futures because of that
//
// TODO: spawn new thread in hook for subsequent recomputations
//
// TODO: will be moved to core
// TODO: migrate to ts
export { default as createStore } from "./createStore";
