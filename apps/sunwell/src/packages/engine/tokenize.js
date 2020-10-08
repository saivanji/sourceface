import moo from "moo"

export default input => {
  lexer.reset(input)

  let item
  let result = []

  while ((item = lexer.next())) {
    if (item.type !== "Space") {
      result.push({
        type:
          item.type !== "Identifier"
            ? item.type
            : filterIdentifiers(item.value),
        value: item.value,
      })
    }
  }

  return result
}

const lexer = moo.compile({
  Numeric: /[0-9]+/,
  String: /'.*?'|".*?"/,
  Punctuator: /->|,|\.\.\.|\.|:|\*|~/,
  Space: / +/,
  Identifier: /[a-zA-Z0-9]+/,
})

/**
 * Manually filtering Boolean and Keyword type, since it's not allowed to pass regex
 * as a keyword. See https://github.com/no-context/moo#keywords
 */
const filterIdentifiers = value =>
  value === "do"
    ? "Keyword"
    : value === "true" || value === "false"
    ? "Boolean"
    : "Identifier"
