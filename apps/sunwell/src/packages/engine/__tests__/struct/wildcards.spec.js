import { parse, Constant } from "../../struct"

test("parses nested constant with wildcard", () => {
  expect(parse("foo.*.bar")).toEqual(new Constant(["foo", "*", "bar"]))
})

test("parses single wildcard constant", () => {
  expect(parse("*")).toEqual(new Constant(["*"]))
})

test("parses nested constant with all wildcards as fields", () => {
  expect(parse("*.*.*")).toEqual(new Constant(["*", "*", "*"]))
})
