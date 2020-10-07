import { parse } from "../../struct"

test("parses identifier", () => {
  expect(parse("foo")).toEqual({ type: "Identifier", name: ["foo"] })
})

test("parses nested identifier", () => {
  expect(parse("foo.bar.baz")).toEqual({
    type: "Identifier",
    name: ["foo", "bar", "baz"],
  })
})
