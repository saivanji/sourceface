import parse from "../../parse"

test("parses number", () => {
  expect(parse("4")).toEqual({ type: "Literal", value: 4 })
})

test("parses string with single quotes", () => {
  expect(parse("'test'")).toEqual({ type: "Literal", value: "test" })
})

test("parses with extra spaces around", () => {
  expect(parse("     4    ")).toEqual({ type: "Literal", value: 4 })
})
