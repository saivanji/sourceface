// TODO:
// - error handling
// - performance check. extra re-renderings, profiling etc.
// - typescript
//
// TODO: handle all of that in hooks?
// - restrict future invalidations usage in non-callbacks.
// - restrict effect calls in non-callbacks
// - restrict function calls in functions args
// - do not have "callback" thing in "store".
//
//
// Example of the flow:
// [a] input5/value.foo.bar
// [o] createOrder()
// [i] foo
// [c] "foobar"
// [s] stage_1.foo.bar
//
// [attribute].input5.value
// [attribute].input5.reveal()
// [stage].stage_1
// [constant]"foo"
// [input].foo
// [future].operations.createOrder() / [operation].createOrder()
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
// TODO: when do not consuming errors as a second argument of "susbscribe" it's propagated somewhere so it can appear in another test
// with "done" definition by a very strange reason. - https://github.com/ReactiveX/rxjs/blob/e04dc573c97cdba89d599fb0a5f4bf51ffd99e01/src/internal/Subscriber.ts#L199 might be useful
//
// Clarification:
// When error handling function is not provided to the 2nd argument of the subscribe function, that error is thrown on a new call stack. Since all tests which accept "done" are executed on a new call stack(which took the thrown error)
//
// That need to be fixed. When 2nd argument is not provided to "subscribe" - silently swallow the error. Since it may cause the confusion that wrong tests might be failed.
//
// Alternatively how to throw these errors so they be displayed in failing tests?
// In case of sync update/errors throw errors synchronously?
//
// Or have test helper to convert observable data to promise
//
//
// TODO: may be module should not be in "references" since it's located at the same page. Rethink idea of references.
// Think of the redirect case where value has "page" reference
export { default as createStore } from "./createStore";
export { default as Cache } from "./cache";
export { default as Interruption } from "./interruption";
export { toPromise } from "./utils";
