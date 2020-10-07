import { parse, Literal } from "../../struct"

test("parses number", () => {
  expect(parse("4")).toEqual(new Literal(4))
})

test("parses with extra spaces around", () => {
  expect(parse("     4    ")).toEqual(new Literal(4))
})
