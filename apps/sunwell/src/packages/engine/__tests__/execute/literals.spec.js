import { evaluate } from "../"

test("evaluates numbers", () => {
  expect(evaluate("5")).toBe(5)
})

test("evaluates strings with single quotes", () => {
  expect(evaluate("'hello'")).toBe("hello")
})

test("evaluates strings with double quotes", () => {
  expect(evaluate('"hello"')).toBe("hello")
})

test("evaluates successfully with extra leading and trailing spaces", () => {
  expect(evaluate("    4      ")).toBe(4)
})
