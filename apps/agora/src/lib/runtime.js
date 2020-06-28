export const exec = (input, scope) => {
  const scopeKeys = Object.keys(scope || {})

  return new Function(
    ...scopeKeys,
    `return eval(${JSON.stringify(input)})`
  ).apply(
    null,
    scopeKeys.map(k => scope[k])
  )
}
