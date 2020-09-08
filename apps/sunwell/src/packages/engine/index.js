// front end and back end will have templating with evaluating

// TODO: most likely templating feature should not be part of a library at all?
// Library is responsible for evaluating expressions only. Templating might be
// in a different library.

// TODO: have "formula" or "expression" name

export const evaluate = (expression, scope) => {
  if (false) {
    throw new EngineSyntaxError()
  }

  if (expression[0] !== "~") {
    return evaluateValue(expression, scope.constants)
  }

  const [, ...[prefix, name, args]] = expression
    .trim()
    .match(/^(?:~([a-z]+)\.)?([a-z][a-zA-Z]+)(?:\s+(.+))?$/)

  const resultArgs =
    args &&
    args
      .replace(/\s/g, "")
      .split(",")
      .reduce((acc, item) => {
        const [name, value = name] = item.split(":")
        return {
          ...acc,
          [name]: evaluateValue(value, scope.constants),
        }
      }, {})

  const func = !prefix ? scope.funcs[name] : scope.funcs[prefix][name]

  return func(resultArgs)
}

export const render = (template, scope) =>
  template.replace(templateRegex, (full, match) => evaluate(match, scope))

export const parseTemplate = temlate =>
  Array.from(temlate.matchAll(templateRegex)).map(
    ([, expression]) => expression
  )

export const replaceTemplate = (template, fn) => {
  let i = 0

  return template.replace(templateRegex, () => fn(i++))
}

const templateRegex = /\{\{\s*(.*?)\s*\}\}/g

const evaluateValue = (value, scope) => {
  try {
    return JSON.parse(value.replace(/'/g, '"'))
  } catch (err) {
    return scope[value]
  }
}

class EngineSyntaxError extends Error {}

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
