import { parse, Constant } from "../../struct"

test("parses constant", () => {
  expect(parse("foo")).toEqual(new Constant(["foo"]))
})

test("parses nested constant", () => {
  expect(parse("foo.bar.baz")).toEqual(new Constant(["foo", "bar", "baz"]))
})
