import interpret from "../../interpret"

test("evaluates numbers", () => {
  expect(interpret("5")).toBe(5)
})

test("evaluates strings with single quotes", () => {
  expect(interpret("'hello'")).toBe("hello")
})

test("evaluates strings with double quotes", () => {
  expect(interpret('"hello"')).toBe("hello")
})

test("evaluates successfully with extra leading and trailing spaces", () => {
  expect(interpret("    4      ")).toBe(4)
})
