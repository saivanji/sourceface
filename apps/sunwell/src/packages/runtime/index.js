import * as Babel from "@babel/standalone"

export const evaluate = (input, scope) => {
  const scopeKeys = Object.keys(scope || {})

  return new Function(
    ...scopeKeys,
    `return eval(${JSON.stringify(
      Babel.transform(`;(async () => ${input})()`, {
        presets: ["env"],
      }).code
    )})`
  ).apply(
    null,
    scopeKeys.map(k => scope[k])
  )
}

// limit
// offset
// currentPage
// queries.countOrders
// queries.orders limit: 1, offset: 2
// queries.orders limit: limit, offset: offset
// queries.orders limit, offset
// queries.removeOrder id: 5
//
// -- Notes --
// Functions might be scoped(with dot) in order to have groupping, for example for queries
// Readable and Writable distinction is needed only on module level, on a language level there is no difference, everything is a function
// There are 3 types in the language. String or Integer(Primitives. Function accepts them as arguments), "Complex" type, is a function result type for some scopes, which could contain anything from integer to an object. Functions could also return primitives
// After parsing the expression there are set of tags are produced, depending on these tags there are various operations are executed(for example sending async operations and so on)
// Runtime is not aware of scopes and their types
// Runtime returns various exceptions(type mismatch and so on)
//
// -- Questions --
// How to allow pass function calls as arguments since we need to pass "currentPage"(Complex type) to the "queries.orders" expression
// - With a return type. Depending on a scope, there will be a specific return type. For example queries scope will have complex type, but if it has no scope, for example "currentPage" - the return type is primitive
// Have 2 functions - parse and evaluate?
//
// -- Conceptions --
// Expression - is a function call to return a value
// Value - is a result of a function call with a specific type
