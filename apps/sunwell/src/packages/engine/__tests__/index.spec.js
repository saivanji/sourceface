import { evaluate } from "../"

test("fails on syntax errors", () => {
  expect(() => evaluate("error[]")).toThrow("Syntax error")
})
