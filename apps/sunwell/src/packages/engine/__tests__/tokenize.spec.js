import tokenize, { LexicalError } from "../tokenize"

test("tokenizes numeric", () => {
  expect(tokenize("4")).toEqual([{ type: "Numeric", value: "4" }])
})

test("tokenizes strings", () => {
  expect(tokenize("'foo' \"bar\"")).toEqual([
    { type: "String", value: "'foo'" },
    { type: "String", value: '"bar"' },
  ])
})

test("tokenizes booleans", () => {
  expect(tokenize("true false")).toEqual([
    { type: "Boolean", value: "true" },
    { type: "Boolean", value: "false" },
  ])
})

test("tokenizes keywords", () => {
  expect(tokenize("do")).toEqual([{ type: "Keyword", value: "do" }])
})

test("tokenizes identifiers", () => {
  expect(tokenize("foo")).toEqual([{ type: "Identifier", value: "foo" }])
})

test("tokenizes punctuators", () => {
  expect(tokenize("-> , . ... : * ~")).toEqual([
    { type: "Punctuator", value: "->" },
    { type: "Punctuator", value: "," },
    { type: "Punctuator", value: "." },
    { type: "Punctuator", value: "..." },
    { type: "Punctuator", value: ":" },
    { type: "Punctuator", value: "*" },
    { type: "Punctuator", value: "~" },
  ])
})

test("tokenizes syntactically wrong code", () => {
  expect(
    tokenize(
      "    4 do 'foo' -> x:    4, , ...bar baz a.b.c       ~     x.*.y.z    true5     false8    do8  \"y\" true  "
    )
  ).toEqual([
    { type: "Numeric", value: "4" },
    { type: "Keyword", value: "do" },
    { type: "String", value: "'foo'" },
    { type: "Punctuator", value: "->" },
    { type: "Identifier", value: "x" },
    { type: "Punctuator", value: ":" },
    { type: "Numeric", value: "4" },
    { type: "Punctuator", value: "," },
    { type: "Punctuator", value: "," },
    { type: "Punctuator", value: "..." },
    { type: "Identifier", value: "bar" },
    { type: "Identifier", value: "baz" },
    { type: "Identifier", value: "a" },
    { type: "Punctuator", value: "." },
    { type: "Identifier", value: "b" },
    { type: "Punctuator", value: "." },
    { type: "Identifier", value: "c" },
    { type: "Punctuator", value: "~" },
    { type: "Identifier", value: "x" },
    { type: "Punctuator", value: "." },
    { type: "Punctuator", value: "*" },
    { type: "Punctuator", value: "." },
    { type: "Identifier", value: "y" },
    { type: "Punctuator", value: "." },
    { type: "Identifier", value: "z" },
    { type: "Identifier", value: "true5" },
    { type: "Identifier", value: "false8" },
    { type: "Identifier", value: "do8" },
    { type: "String", value: '"y"' },
    { type: "Boolean", value: "true" },
  ])
})

test("fails to tokenize unknown symbols", () => {
  expect(() => tokenize("[]##test")).toThrow(
    new LexicalError("Unexpected input")
  )
})
