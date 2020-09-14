import { evaluate } from "../"

test("evaluates numbers", () => {
  expect(evaluate("5")).toBe(5)
})

test("evaluates strings with single quotes", () => {
  expect(evaluate("'hello'")).toBe(5)
})

test("evaluates strings with double quotes", () => {
  expect(evaluate('"hello"')).toBe(5)
})

test("evaluates variables from the scope", () => {
  expect(evaluate("x", { x: 4 })).toBe(4)
})

test("fails when variable not exist", () => {})

test("evaluates nested object properies", () => {
  expect(evaluate("foo.bar.baz", { foo: { bar: { baz: 4 } } })).toBe(4)
})

test("evaluates variables when shortcut is set", () => {
  expect(
    evaluate(
      "~x",
      { foo: { bar: { x: 4 } } },
      { shortcuts: { "foo.bar": "~" } }
    )
  ).toBe(4)
})

test("evaluates function call from the scope", () => {
  expect(evaluate("exec", { exec: () => 8 })).toBe(8)
})

test("evaluates function call with arguments", () => {
  expect(evaluate("exec x: 8, y: 2", { exec: ({ x, y }) => x + y })).toBe(10)
})

test("evaluates function call with variable arguments", () => {
  expect(
    evaluate("exec x: a, y: b", { exec: ({ x, y }) => x + y, a: 8, b: 2 })
  ).toBe(10)
})

test("evaluates function call with shorthand variable arguments", () => {
  expect(evaluate("exec x, y", { exec: ({ x, y }) => x + y, x: 8, y: 2 })).toBe(
    10
  )
})

test("evaluates function call with nested shorthand variable arguments", () => {
  expect(
    evaluate("exec foo.x, bar.y", {
      exec: ({ x, y }) => x + y,
      foo: { x: 8 },
      bar: { y: 2 },
    })
  ).toBe(10)
})

test("evaluates nested object properies function call", () => {
  expect(evaluate("foo.bar.baz", { foo: { bar: { baz: () => 4 } } })).toBe(4)
})

test("evaluates function call when shortcut is set", () => {
  expect(
    evaluate(
      "~exec",
      { foo: { bar: { exec: 4 } } },
      { shortcuts: { "foo.bar": "~" } }
    )
  ).toBe(4)
})

test("evaluates function call with variable arguments when shortcut is set", () => {
  expect(
    evaluate(
      "exec x: ~a, y: b",
      {
        exec: ({ x, y }) => x + y,
        foo: { bar: { a: 8 } },
        b: 2,
      },
      {
        shortcuts: {
          "foo.bar": "~",
        },
      }
    )
  ).toBe(10)
})

test("evaluates function call with shorthand variable arguments when shortcut is set", () => {
  expect(
    evaluate(
      "exec ~x, y",
      { exec: ({ x, y }) => x + y, foo: { bar: { x: 8 } }, y: 2 },
      { shortcuts: { "foo.bar": "~" } }
    )
  ).toBe(10)
})

test("evaluates function call with nested shorthand variable arguments when shortcut is set", () => {
  expect(
    evaluate(
      "exec ~baz.x, bar.y",
      {
        exec: ({ x, y }) => x + y,
        foo: {
          bar: {
            baz: { x: 8 },
          },
        },
        bar: { y: 2 },
      },
      {
        shortcuts: {
          "foo.bar": "~",
        },
      }
    )
  ).toBe(10)
})

test("fails to accept function call as argument", () => {
  expect(evaluate("exec x: bar", { exec: () => 8, bar: () => 4 }))
})

test("fails to accept function call as argument when passed as a shorthand", () => {
  expect(evaluate("exec bar", { exec: () => 8, bar: () => 4 }))
})
