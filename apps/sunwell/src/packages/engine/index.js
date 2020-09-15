// front end and back end will have templating with evaluating

// TODO: most likely templating feature should not be part of a library at all?
// Library is responsible for evaluating expressions only. Templating might be
// in a different library.

// TODO: have "comma", "command", "run", "execute" as name.  alternate - "formula" or "expression" name

export const evaluate = (expression, scope = {}, { shortcuts = {} } = {}) => {
  /**
   * Making sure syntax is correct.
   * TODO: accept valid list of shortcuts
   */
  if (false) {
    throw "Syntax error"
  }

  const [variable, args] = parse(expression, shortcuts)

  /**
   * No arguments means that variable is the expression that contains literal or
   * a function call without arguments. Therefore we can directly evaluate it.
   */
  if (!args) {
    return evaluateVariable(variable, scope, true)
  }

  return applyFunc(variable, args, scope)
}

const validShortcuts = ["@", "~", "$"]

const parse = (expression, shortcuts) => {
  const [variable, ...rest] = expression.trim().split(" ")

  const args =
    rest.length &&
    rest
      .join("")
      .split(",")
      .map(arg => parseArgument(arg, shortcuts))
      .reduce((acc, arg) => ({ ...acc, ...arg }), {})

  return [replaceShortcuts(variable, shortcuts), args]
}

const replaceShortcuts = (input, shortcuts) => {
  if (!validShortcuts.includes(input[0])) {
    return input
  }

  for (let path of Object.keys(shortcuts)) {
    const shortcut = shortcuts[path]

    if (input[0] === shortcut) {
      return `${path}.${input.slice(1)}`
    }
  }

  throw "Shortcut is not defined"
}

const parseArgument = (arg, shortcuts) => {
  const [key, value = key] = arg.split(":")

  /**
   * Making sure argument name has no shortcuts in case shortcut is used
   * together with shorthand arguments:
   * `exec ~foo`
   *
   * Also making sure argument name contains the last property name in case
   * nested shorthand variable was passed:
   * `exec foo.bar.baz`
   */
  const name = replaceShortcuts(key, shortcuts).split(".").splice(-1)[0]

  return { [name]: replaceShortcuts(value, shortcuts) }
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

    if (!value) {
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

class SyntaxError {}

class ParseError {}

class EvaluationError {}

// export const evaluate = (expression, scope) => {
//   /**
//    * Making sure syntax is correct.
//    */
//   if (false) {
//     throw "Syntax error"
//   }

//   if (expression[0] !== "~") {
//     return evaluateValue(expression, scope.constants)
//   }

//   const [, ...[prefix, name, args]] = expression
//     .trim()
//     .match(/^(?:~([a-z]+)\.)?([a-z][a-zA-Z]+)(?:\s+(.+))?$/)

//   const resultArgs =
//     args &&
//     args
//       .replace(/\s/g, "")
//       .split(",")
//       .reduce((acc, item) => {
//         const [name, value = name] = item.split(":")
//         return {
//           ...acc,
//           [name]: evaluateValue(value, scope.constants),
//         }
//       }, {})

//   const func = !prefix ? scope.funcs[name] : scope.funcs[prefix][name]

//   return func(resultArgs)
// }

// export const render = (template, scope) =>
//   template.replace(templateRegex, (full, match) => evaluate(match, scope))

// export const parseTemplate = temlate =>
//   Array.from(temlate.matchAll(templateRegex)).map(
//     ([, expression]) => expression
//   )

// export const replaceTemplate = (template, fn) => {
//   let i = 0

//   return template.replace(templateRegex, () => fn(i++))
// }

// const templateRegex = /\{\{\s*(.*?)\s*\}\}/g

// const evaluateValue = (value, scope) => {
//   try {
//     /**
//      * JSON.parse parses only double-quoted strings so replacing them in
//      * order to succeed.
//      */
//     return JSON.parse(value.replace(/'/g, '"'))
//   } catch (err) {
//     return scope[value]
//   }
// }

// class EngineSyntaxError extends Error {}

// console.log(
//   render("hello {{ foo }} {{ bar }} abc", { constants: { foo: "world" } })
// )

// console.log(
//   evaluate("~commands.ordersList limit: 1, offset: offset, foo, bar: '123'", {
//     funcs: {
//       commands: {
//         ordersList: ({ limit }) => limit,
//       },
//     },
//     constants: {
//       offset: 5,
//       foo: "hello",
//     },
//   })
// )
//
// New syntax:
//
// `listOrders`
// `listOrders local.limit, local.offset`
// `listOrders ~limit, ~offset`
// `listOrders search: input1.value`
// `listOrders input2.foo.bar, offset: 5`
// `foo.bar.listOrders limit: 1, offset: 5`
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
//
// evaluate("listOrders ~limit ~offset", {
//   functions: {
//     foo: {
//       bar: {
//         listOrders: () => {}
//       }
//     }
//   },
//   literals: {
//     local: {
//       limit: 1,
//       offset: 5
//     }
//     foo: {
//       bar: {
//         baz: 4
//       }
//     }
//   }
// }, {
//   shortcuts: {
//     'local': '~',
//     'foo.bar': '@'
//   }
// })
