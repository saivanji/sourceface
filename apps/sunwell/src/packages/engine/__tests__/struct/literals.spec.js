import { parse, Literal } from "../../struct"

test("parses number", () => {
  expect(parse("4")).toEqual(new Literal(4))
})

test("parses string with single quotes", () => {
  expect(parse("'test'")).toEqual(new Literal("test"))
})

test("parses with extra spaces around", () => {
  expect(parse("     4    ")).toEqual(new Literal(4))
})
