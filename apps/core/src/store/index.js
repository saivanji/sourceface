// TODO: how to leverage React concurrent mode at full capacity in core? Should interface of "store" be changed because of that?
// Install alpha react and integrate Suspense, ErrorBoundary, useTransition and other new concurrent features.
//
//
// TODO:
// - interruption should be a Symbol
// - in case of interruption in dictionary stage, catch every value. Right now first throws block the rest dictionary fields
// - do not need to catch in store. catching should happen on the level above. computation either succeeds or throws
//
//   in case of any *unhandled* failure from computation, we should display generic error state for the module. In editor mode - we additionally display meta information of the error on hover. Should unhandled interruption errors in callbacks be ignored? Do we need to display specific user errors in "read" settings computation?
//
// - should we have different Interruption types? One for silent ignores(in callbacks) - SilentInterruption, another for the errors which needs to be displayed(either with notification or in module area), for example - "email already exists"
//
// - SilentInterruption can not appear on read, since it's thrown from method selector, which can only be called inside of callback. Catch SilentInterruption in hooks. We throw SilentInterruption in any stage type. For dictionary we execute all keys, and if one has that exception thrown - throw interruption.
//   SilentInterruption have no message attached.
//   SilentInterruption should be thrown ONLY from method selectors and ONLY when the error is handled by the module itself, for example the message is displayed in the UI.
//   SilentInterruption should be catched in useSettingCallback hook only
//   Have just Interruption name
//
// - No need to have "catch" construction in stages. If something went wrong - we just display message/notification. Complex orchestration cases should be resolved on a controller level. Since "stages" is conception for handling UI things.
//
// - how user will handle 4** errors from operations? for example "email already exists"?
// operations should throw Exception with user-friendly message provided.
// when thrown in read mode - display that message in module area with the same UI as generic error.
// when thrown in callback mode - display notification
//
//
// TODO: how to handle sync errors when we get initial value in React? Keep in mind that rxjs throws sync errors on another callstack.
//
//
//
//
//
// - should we differ callbacks and read settings? for example have them under different keys. read under "fields" and callbacks under "callbacks"?
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
// Most likely the solution is to put "done" as second argument of the subscribe
//
//
// TODO: may be module should not be in "references" since it's located at the same page. Rethink idea of references.
// Think of the redirect case where value has "page" reference

export { default as createStore } from "./createStore";
export { default as Interruption } from "./interruption";
export { toPromise, createCacheBucket } from "./utils";
