export const exec = (input, scope) => {
  const vars =
    scope &&
    Object.keys(scope)
      .reduce(
        (acc, key) => [...acc, `const ${key}=${stringify(scope[key])}`],
        []
      )
      .join(";")

  // restricting input to have only expressions and filtering out statements
  const expr = input.split(";")[0]

  return eval(`${vars};${expr}`)
}

const stringify = val =>
  typeof val === "function"
    ? val.toString()
    : typeof val === "object" && !(val instanceof Array)
    ? "{" +
      Object.keys(val).reduce(
        (acc, key) => acc + `${[JSON.stringify(key)]}: ${stringify(val[key])}`,
        ""
      ) +
      "}"
    : JSON.stringify(val)
