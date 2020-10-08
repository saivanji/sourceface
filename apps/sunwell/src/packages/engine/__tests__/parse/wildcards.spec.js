import parse from "../../parse"

test("parses nested constant with wildcard", () => {
  expect(parse("foo.*.bar")).toEqual({
    type: "Member",
    name: ["foo", "*", "bar"],
  })
})

test("parses single wildcard constant", () => {
  expect(parse("*")).toEqual({ type: "Member", name: ["*"] })
})

test("parses nested constant with all wildcards as fields", () => {
  expect(parse("*.*.*")).toEqual({ type: "Member", name: ["*", "*", "*"] })
})
