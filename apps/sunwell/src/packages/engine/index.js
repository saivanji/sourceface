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

// TODO: implement ability to define empty function such as:
// `->`
// `x ->`

// TODO: implement ability to call multiple fields/functions(use re-throw technique from "core.map"):
// `do binds.form.*.justify` will call justify for all form members and return object with results
// `do modules.form_*.justify` will call justify for modules which starts with "form_" and return object with results
// `binds.form.*.value` will return object with form values
//
// can have multiple paths:
// `binds.form.*.*.value`
//
// can have template at the end:
// `modules.form_*`
// `modules.*` even though that doesn't make much sense since it's equal to `modules`

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

// TODO change name since function calls are not expressions.
const evaluateExpression = (
  expression,
  scope = {},
  { namespaces = {} } = {}
) => {
  const trimmed = expression.trim()
  const isCall = trimmed.indexOf("do") === 0
  const [raw, ...rest] = isCall ? trimmed.slice(3).split(" ") : [trimmed]

  const variable = replaceNamespaces(raw, namespaces)
  const args = rest.length ? parseArgs(rest, scope, namespaces) : {}

  /**
   * No arguments means that variable is the expression that contains literal or
   * a function call without arguments. Therefore we can directly evaluate it.
   */
  if (!isCall) {
    return evaluateVariable(variable, scope)
  }

  return applyFunc(variable, args, scope)
}

const validNamespaces = ["@", "~", "$"]

const parseArgs = (argsString, scope, namespaces) =>
  argsString
    .join("")
    .split(",")
    .map(arg =>
      arg.indexOf("...") === 0
        ? parseSpread(arg, scope, namespaces)
        : [parseArgument(arg, namespaces)]
    )
    /**
     * Merging argument groups to a single object
     */
    .reduce(
      (acc, group) => ({
        ...acc,
        ...group.reduce((acc, arg) => ({ ...acc, ...arg }), {}),
      }),
      {}
    )

const parseSpread = (spreadString, scope, namespaces) => {
  const name = replaceNamespaces(spreadString.slice(3), namespaces)

  return Object.keys(look(name, scope)).reduce(
    (acc, key) => [...acc, { [key]: `${name}.${key}` }],
    []
  )
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
  const evaluated = evaluateArgs(args, scope)

  return look(variable, scope, fn => {
    // console.log(fn)
    if (typeof fn === "undefined") {
      throw "Variable is not defined"
    }

    if (typeof fn !== "function") {
      throw "Can not call non function type"
    }

    return fn(evaluated)
  })
}

/**
 * Looks for a variable in a scope.
 */
const look = (variable, scope, apply) => {
  const path = variable.split(".").filter(Boolean)
  let result = scope

  for (let [i, selector] of path.entries()) {
    const wildcardAt = selector.indexOf("*")

    /**
     * Looking for wildcard fields.
     */
    if (wildcardAt !== -1) {
      const context = get(path.slice(0, i), scope)

      return (
        context &&
        over(
          value => look(path.slice(i + 1).join("."), value, apply),
          selector,
          context
        )
      )
    }

    const value = result && result[selector]

    /**
     * Applying functions when we're in a leaf.
     */
    // TODO: why it's working when added "value" to a condition?
    if (i === path.length - 1 && apply) {
      return apply(value)
    }

    result = value
  }

  return result
}

const over = (fn, selector, obj) => {
  let result

  for (let key of Object.keys(obj)) {
    const nextKey = match(key, selector)
    const value = nextKey && fn(obj[key])

    if (typeof value !== "undefined" && nextKey) {
      /**
       * Assigning empty object to result only when we have something to write and
       * result is empty. This let's to avoid returning empty object in when all
       * values are undefined.
       */
      result = result || {}
      result[nextKey] = value
    }
  }

  return result
}

const match = (key, selector) => {
  const wildcardAt = selector.indexOf("*")

  const before = selector.slice(0, wildcardAt)
  const after = selector.slice(wildcardAt + 1)

  let result = key

  if (before) {
    result = result.slice(before.length)
  }

  if (after) {
    result = result.slice(0, -after.length)
  }

  return result
}

const evaluateArgs = (args, scope) =>
  Object.keys(args).reduce(
    (acc, key) => ({
      ...acc,
      [key]: evaluateVariable(args[key], scope),
    }),
    {}
  )

/**
 * Evaluates literal or a function call without arguments.
 * TODO: think about name, since string and number are not variables.
 */
const evaluateVariable = (expression, scope) => {
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

    return value
  }
}

const get = (path, obj) => {
  let result = obj

  for (let key of path) {
    result = result && result[key]
  }

  return result
}

class SyntaxError extends Error {}

class ParseError extends Error {}

class EvaluationError extends Error {}
