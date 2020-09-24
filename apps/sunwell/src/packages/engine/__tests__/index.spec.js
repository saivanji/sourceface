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

test("evaluates variables from the scope", () => {
  expect(evaluate("x", { x: 4 })).toBe(4)
})

test("evaluates nested object properies", () => {
  expect(evaluate("foo.bar.baz", { foo: { bar: { baz: 4 } } })).toBe(4)
})

test("evaluates variables when namespace is set", () => {
  expect(
    evaluate(
      "~x",
      { foo: { bar: { x: 4 } } },
      { namespaces: { "foo.bar": "~" } }
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

test("evaluates function call with nested variable arguments", () => {
  expect(
    evaluate("exec x: foo.x, y: bar.y", {
      exec: ({ x, y }) => x + y,
      foo: { x: 8 },
      bar: { y: 2 },
    })
  ).toBe(10)
})

test("evaluates nested object properies function call", () => {
  expect(evaluate("foo.bar.baz", { foo: { bar: { baz: () => 4 } } })).toBe(4)
})

test("evaluates function call when namespace is set", () => {
  expect(
    evaluate(
      "~exec",
      { foo: { bar: { exec: 4 } } },
      { namespaces: { "foo.bar": "~" } }
    )
  ).toBe(4)
})

test("evaluates function call with variable arguments when namespace is set", () => {
  expect(
    evaluate(
      "exec x: ~a, y: b",
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
    evaluate(
      "exec ~x, y",
      { exec: ({ x, y }) => x + y, foo: { bar: { x: 8 } }, y: 2 },
      { namespaces: { "foo.bar": "~" } }
    )
  ).toBe(10)
})

test("evaluates function call with nested shorthand variable arguments when namespace is set", () => {
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
        namespaces: {
          "foo.bar": "~",
        },
      }
    )
  ).toBe(10)
})

test("evaluates successfully with extra leading and trailing spaces", () => {
  expect(evaluate("    4      ")).toBe(4)
})

test("evaluates successfully function call with extra leading spaces in the first argument", () => {
  expect(evaluate("exec      x: 8", { exec: ({ x }) => x })).toBe(8)
})

test("evaluates successfully function call with arguments with extra spaces in between", () => {
  expect(
    evaluate("exec x:   8,    y  : 2", { exec: ({ x, y }) => x + y })
  ).toBe(10)
})

test("evaluates successfully function definitions without parameters", () => {
  const fn = evaluate("-> exec x: 1, y: 2", { exec: ({ x, y }) => x + y })

  expect(typeof fn).toBe("function")
  expect(fn()).toBe(3)
})

test("evaluates successfully function definitions without parameters and extra spaces", () => {
  const fn = evaluate("   -> exec x: 1, y: 2", { exec: ({ x, y }) => x + y })

  expect(typeof fn).toBe("function")
  expect(fn()).toBe(3)
})

test("evaluates successfully function definitions with single parameter", () => {
  const fn = evaluate("x -> exec x, y: 2", { exec: ({ x, y }) => x + y })

  expect(typeof fn).toBe("function")
  expect(fn({ x: 3 })).toBe(5)
})

test("evaluates successfully function definitions with single parameter and extra spaces", () => {
  const fn = evaluate("    x      -> exec x, y: 2", {
    exec: ({ x, y }) => x + y,
  })

  expect(typeof fn).toBe("function")
  expect(fn({ x: 3 })).toBe(5)
})

test("evaluates successfully function definitions with multiple parameters", () => {
  const fn = evaluate("x, y -> exec x, y", { exec: ({ x, y }) => x + y })

  expect(typeof fn).toBe("function")
  expect(fn({ x: 3, y: 4 })).toBe(7)
})

test("evaluates successfully function definitions with multiple parameters and extra spaces", () => {
  const fn = evaluate("    x,      y       -> exec x, y", {
    exec: ({ x, y }) => x + y,
  })

  expect(typeof fn).toBe("function")
  expect(fn({ x: 3, y: 4 })).toBe(7)
})

test("evaluates successfully function definitions with single parameter and result function fails", () => {
  const fn = evaluate("x -> exec x, y", { exec: ({ x, y }) => [x, y] })

  expect(typeof fn).toBe("function")
  expect(() => fn({ x: 3, y: 4 })).toThrow("Variable is not defined")
})

test("fails on syntax errors", () => {
  expect(() => evaluate("error[]")).toThrow("Syntax error")
})

test("fails when variable not exist", () => {
  expect(() => evaluate("x")).toThrow("Variable is not defined")
})

test("fails to call a function when variable has wrong type", () => {
  expect(() => evaluate("foo bar: 4", { foo: 2 })).toThrow(
    "Can not call non function type"
  )
})

test("fails to accept function call as argument", () => {
  expect(() =>
    evaluate("exec x: bar", { exec: () => 8, bar: () => 4 })
  ).toThrow("Can not accept function as argument")
})

test("fails to accept function call as argument when passed as a shorthand", () => {
  expect(() => evaluate("exec bar", { exec: () => 8, bar: () => 4 })).toThrow(
    "Can not accept function as argument"
  )
})

test("fails when namespace is not defined", () => {
  expect(() => evaluate("~x", { foo: { bar: { x: 4 } } })).toThrow(
    "Namespace is not defined"
  )
})
