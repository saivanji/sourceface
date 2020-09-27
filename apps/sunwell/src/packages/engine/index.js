// front end and back end will have templating with evaluating

// TODO: most likely templating feature should not be part of a library at all?
// Library is responsible for evaluating expressions only. Templating might be
// in a different library.

// TODO: have "comma", "command", "run", "execute" as name.  alternate - "formula" or "expression" name

// New syntax:
//
// `listOrders`
// `listOrders local.limit, local.offset`
// `listOrders ~limit, ~offset`
// `listOrders search: input1.value`
// `listOrders input2.foo.bar, offset: 5`
// `foo.bar.listOrders limit: 1, offset: 5`
//
// function definition:
// `x, y -> listOrders x, y, foo: ~bar`
// `-> listOrders x, y`
//
// TODO: is it fine to call functions the same way we evaluates variables, for example:
// `foo` is a literal in the scope
// `foo` is function in the scope
//
// TODO: literals and functions are in different scopes. Therefore
// it may happen that we have code like that:
// `orders orders`, where 1st `orders` is a function and another one is
// argument. Should we have single scope for literals and functions in the
// application level? If yes, should engine have it as well? What are the
// benefits of having single and separate scopes?
//
// TODO: should we replace named arguments by position arguments for simplicity?

// TODO: implement arguments spread
// `foo.bar ...form` is equal to:
// `foo.bar x: form.x, y: form.y`
// TODO: implement arguments spread when defining a function

// TODO: separate function calls from regular values as it's done in js?
// `do core.navigate to: '/orders'`

// TODO: implement position arguments for function as in js?

// TODO: should return `undefined` when input is ``?

export const evaluate = (input, scope, options) => {
  /**
   * Making sure syntax is correct.
   * TODO: accept valid list of namespaces
   */
  if (false) {
    throw "Syntax error"
  }

  /**
   * Checking whether input is a function.
   */
  const parsed = input.split("->")

  if (parsed.length === 1) {
    return evaluateExpression(input, scope, options)
  }

  return args => {
    const argsScope = parsed[0]
      .split(",")
      .map(x => x.trim())
      .filter(Boolean)
      .reduce((acc, param) => ({ ...acc, [param]: args[param] }), {})

    return evaluateExpression(parsed[1], { ...scope, ...argsScope }, options)
  }
}

const evaluateExpression = (
  expression,
  scope = {},
  { namespaces = {} } = {}
) => {
  const [variable, args] = parseExpression(expression, namespaces)

  /**
   * No arguments means that variable is the expression that contains literal or
   * a function call without arguments. Therefore we can directly evaluate it.
   */
  if (!args) {
    return evaluateVariable(variable, scope, true)
  }

  return applyFunc(variable, args, scope)
}

const validNamespaces = ["@", "~", "$"]

const parseExpression = (expression, namespaces) => {
  const [variable, ...rest] = expression.trim().split(" ")

  const args = rest.length
    ? rest
        .join("")
        .split(",")
        .map(arg => parseArgument(arg, namespaces))
        .reduce((acc, arg) => ({ ...acc, ...arg }), {})
    : undefined

  return [replaceNamespaces(variable, namespaces), args]
}

const replaceNamespaces = (input, namespaces) => {
  if (!validNamespaces.includes(input[0])) {
    return input
  }

  for (let path of Object.keys(namespaces)) {
    const namespace = namespaces[path]

    if (input[0] === namespace) {
      return `${path}.${input.slice(1)}`
    }
  }

  throw "Namespace is not defined"
}

const parseArgument = (arg, namespaces) => {
  const [key, value = key] = arg.split(":")

  /**
   * Making sure argument name has no namespaces in case namespace is used
   * together with shorthand arguments:
   * `exec ~foo`
   *
   * Also making sure argument name contains the last property name in case
   * nested shorthand variable was passed:
   * `exec foo.bar.baz`
   */
  const name = replaceNamespaces(key, namespaces).split(".").splice(-1)[0]

  return { [name]: replaceNamespaces(value, namespaces) }
}

const applyFunc = (variable, args, scope) => {
  const fn = look(variable, scope)

  if (typeof fn !== "function") {
    throw "Can not call non function type"
  }

  return fn(evaluateArgs(args, scope))
}

/**
 * Looks for a variable in a scope.
 */
const look = (variable, scope) => {
  const path = variable.split(".")
  let result = scope

  for (let key of path) {
    result = result[key]
  }

  return result
}

const evaluateArgs = (args, scope) =>
  Object.keys(args).reduce(
    (acc, key) => ({
      ...acc,
      [key]: evaluateVariable(args[key], scope, false),
    }),
    {}
  )

/**
 * Evaluates literal or a function call without arguments.
 * TODO: think about name, since string and number are not variables.
 */
const evaluateVariable = (expression, scope, passFunc = false) => {
  try {
    /**
     * In case expression contains numbers or strings, using JSON.parse.
     *
     * JSON.parse parses only double-quoted strings so replacing them in
     * order to succeed.
     */
    return JSON.parse(expression.replace(/'/g, '"'))
  } catch (err) {
    /**
     * In case variable is found in the scope - returning the value. Otherwise
     * fail.
     */
    const value = look(expression, scope)

    if (typeof value === "undefined") {
      throw "Variable is not defined"
    }

    if (typeof value === "function") {
      if (!passFunc) {
        throw "Can not accept function as argument"
      }

      return value()
    }

    return value
  }
}

class SyntaxError extends Error {}

class ParseError extends Error {}

class EvaluationError extends Error {}
