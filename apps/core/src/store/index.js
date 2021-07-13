// TODO: have separate stream for editor updates, which will contain actions. modules/stages/values streams will subscribe
// on that stream and will apply updates accordingly with reducer pattern.
//
// TODO: when editing modules/stages/values, do not split every field on streams, instead keep streams as we have now(on entry level)
// and apply value memoization in hooks to avoid extra re-renderings when another entry field is updated the same way it's done
// in react-redux.
//
// TODO: consider testing library through a public interface and rename FakeRegistry to FakeData/FakeEntities
// test files should be named differently since we do not focus on specifics such "computeValue".
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
