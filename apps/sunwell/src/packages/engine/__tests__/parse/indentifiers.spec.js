import parse from "../../parse"

test("parses member", () => {
  expect(parse("foo")).toEqual({ type: "Member", name: ["foo"] })
})

test("parses nested member", () => {
  expect(parse("foo.bar.baz")).toEqual({
    type: "Member",
    name: ["foo", "bar", "baz"],
  })
})
