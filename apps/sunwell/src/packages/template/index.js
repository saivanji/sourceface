export const parse = temlate =>
  Array.from(temlate.matchAll(templateRegex)).map(
    ([, expression]) => expression
  )

export const replace = (template, fn) => {
  let i = 0

  return template.replace(templateRegex, (full, match) => fn(i++, match))
}

const templateRegex = /\{\{\s*(.*?)\s*\}\}/g
