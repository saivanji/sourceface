import interpret from "../../interpret"

test("evaluates variables when namespace is set", () => {
  expect(
    interpret(
      "~x",
      { foo: { bar: { x: 4 } } },
      { namespaces: { "foo.bar": "~" } }
    )
  ).toBe(4)
})

test("evaluates function call when namespace is set", () => {
  expect(
    interpret(
      "do ~exec",
      { foo: { bar: { exec: () => 4 } } },
      { namespaces: { "foo.bar": "~" } }
    )
  ).toBe(4)
})

test("evaluates function call with variable arguments when namespace is set", () => {
  expect(
    interpret(
      "do exec x: ~a, y: b",
      {
        exec: ({ x, y }) => x + y,
        foo: { bar: { a: 8 } },
        b: 2,
      },
      {
        namespaces: {
          "foo.bar": "~",
        },
      }
    )
  ).toBe(10)
})

test("evaluates function call with shorthand variable arguments when namespace is set", () => {
  expect(
    interpret(
      "do exec ~x, y",
      { exec: ({ x, y }) => x + y, foo: { bar: { x: 8 } }, y: 2 },
      { namespaces: { "foo.bar": "~" } }
    )
  ).toBe(10)
})

test("evaluates function call with nested shorthand variable arguments when namespace is set", () => {
  expect(
    interpret(
      "do exec ~baz.x, bar.y",
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
        namespaces: {
          "foo.bar": "~",
        },
      }
    )
  ).toBe(10)
})

test("fails when namespace is not defined", () => {
  expect(() => interpret("~x", { foo: { bar: { x: 4 } } })).toThrow(
    "Namespace is not defined"
  )
})
