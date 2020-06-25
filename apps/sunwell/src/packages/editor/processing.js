// move to 2 separate packages, "templating" and "eval"?

export const render = (template, scope) =>
  template.replace(regex, (full, match) => exec(match, scope))

export const exec = (input, scope) => {
  const vars = Object.keys(scope)
    .reduce((acc, key) => [...acc, `const ${key}=${stringify(scope[key])}`], [])
    .join(";")

  // restricting input to have only expressions and filtering out statements
  const expr = input.split(";")[0]

  return eval(`${vars};${expr}`)
}

export const parseTemplate = template => {
  let result = []

  template.replace(regex, (full, match) => result.push(match))

  return result
}

const regex = /\{\{\s*(.*?)\s*\}\}/g

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

// console.log(exec("a + b", { a: 1, b: 2 }));

// console.log(
//   render(
//     "Hello, {{ firstName }} {{ lastName }} {{ foo(one, two) }} {{ arr }} {{ obj; 5 }}",
//     {
//       firstName: "John",
//       lastName: "Doe",
//       one: 1,
//       two: 2,
//       foo: (a, b) => a + b,
//       arr: [1, 2, 3],
//       obj: { foo: "bar" }
//     }
//   )
// );
