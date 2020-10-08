import interpret from "../../interpret"

test("fails on syntax errors", () => {
  expect(() => interpret("error[]")).toThrow("Syntax error")
})
