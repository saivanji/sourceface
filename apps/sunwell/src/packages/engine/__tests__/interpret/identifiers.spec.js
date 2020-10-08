import { evaluate } from "../"

test("evaluates variables from the scope", () => {
  expect(evaluate("x", { x: 4 })).toBe(4)
})

test("evaluates nested object properies", () => {
  expect(evaluate("foo.bar.baz", { foo: { bar: { baz: 4 } } })).toBe(4)
})

test("fails when variable not exist while accessing nested object prop", () => {
  expect(() => evaluate("x.y.z")).toThrow("Variable is not defined")
})

test("fails when object property not exist", () => {
  expect(() => evaluate("x.y.z", { x: { foo: 1 } })).toThrow(
    "Variable is not defined"
  )
})

test("evaluates successfully when function is returned", () => {
  expect(evaluate("foo", { foo: () => 7 })()).toBe(7)
})

test("fails when variable not exist", () => {
  expect(() => evaluate("x")).toThrow("Variable is not defined")
})
