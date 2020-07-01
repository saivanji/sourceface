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
