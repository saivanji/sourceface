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
// ~commands.countOrders
// ~commands.orders limit: 1, offset: 2
// ~commands.orders limit: limit, offset: offset
// ~commands.orders limit, offset
// ~commands.removeOrder id: 5
//
// -- Notes --
// Functions might be prefixed(with dot) in order to have groupping, for example for commands
// Readable and Writable distinction is needed only on module level, on a language level there is no difference, everything is a function
// There are 3 types in the language. String or Integer(Primitives. Function accepts them as arguments along with constants). Complex type is a return type of a function. It's not accepted as arguments.
// Functions accept either constants or literal as input.
// Runtime returns various syntax exceptions
//
// -- Roadmap --
// There will be a conception of a map. Map is an object. functions are already accepting it as a single argument. Also replace prefix conception by a map
// There will be ability to define a function as following:
// x, z -> x.y
// There will be arithmetic operations introduced with constants and primitives(number), in place where we can put value(constant or literal) we can put arithmetic operation since it's return type is a value
// Think of having generic way for providing string and other data type input, since it's inconsistent for the user to have 2 inputs(template and expression)
//   - If braces are provided - then consider as template, otherthise as expression?
// Think of having conditions inside of templates
//
// -- Conceptions --
// Expression - is a function call returning a complex type or expression is a Value
//  - Function is prepended with tilda
// Value
// - Constant - named literal
// - Literal - either string or number value
