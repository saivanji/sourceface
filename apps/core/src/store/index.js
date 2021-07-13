// TODO:
// 1. share promise in future value computation
// 2. use functional updates in input module
// 3. provide "input" scope to computeSetting
// 4. implement "stage" scope
// 5. implement wildcard value. form_*.reveal(), form_*.value
// 6. implement methods
// 7. implement future invalidations
// 8. implement "container" module
// 9. implement @mount field
//
//
// TODO: have separate stream for editor updates, which will contain actions. modules/stages/values streams will subscribe
// on that stream and will apply updates accordingly with reducer pattern.
//
// TODO: when editing modules/stages/values, do not split every field on streams, instead keep streams as we have now(on entry level)
// and apply value memoization in hooks to avoid extra re-renderings when another entry field is updated the same way it's done
// in react-redux.
//
// As alternative solution, we might apply debounceTime(0) in the hook only when we subscribe
// to the next update and use raw compute* without debouncing when we need initial value.
// Alternatively, we can leave using debounceTime(0) and just leverage ReactDOM.unstable_batchedUpdates feature
//
// TODO: spawn new thread in hook for subsequent recomputations
//
// TODO: migrate to ts
export { default as createStore } from "./createStore";
