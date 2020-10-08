import { parse } from "../../struct"

test("parses nested constant with wildcard", () => {
  expect(parse("foo.*.bar")).toEqual({
    type: "Identifier",
    name: ["foo", "*", "bar"],
  })
})

test("parses single wildcard constant", () => {
  expect(parse("*")).toEqual({ type: "Identifier", name: ["*"] })
})

test("parses nested constant with all wildcards as fields", () => {
  expect(parse("*.*.*")).toEqual({ type: "Identifier", name: ["*", "*", "*"] })
})
