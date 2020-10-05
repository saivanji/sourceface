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
  expect(evaluate("do exec", { exec: () => 8 })).toBe(8)
})

test("evaluates function call with arguments", () => {
  expect(evaluate("do exec x: 8, y: 2", { exec: ({ x, y }) => x + y })).toBe(10)
})

test("evaluates function call with variable arguments", () => {
  expect(
    evaluate("do exec x: a, y: b", { exec: ({ x, y }) => x + y, a: 8, b: 2 })
  ).toBe(10)
})

test("evaluates function call with shorthand variable arguments", () => {
  expect(
    evaluate("do exec x, y", { exec: ({ x, y }) => x + y, x: 8, y: 2 })
  ).toBe(10)
})

test("evaluates function call with nested shorthand variable arguments", () => {
  expect(
    evaluate("do exec foo.x, bar.y", {
      exec: ({ x, y }) => x + y,
      foo: { x: 8 },
      bar: { y: 2 },
    })
  ).toBe(10)
})

test("evaluates function call with function argument passed as a shorthand", () => {
  expect(
    evaluate("do exec bar", {
      exec: ({ bar }) => 8 + bar(),
      bar: () => 4,
    })
  ).toBe(12)
})

test("evaluates function call with nested variable arguments", () => {
  expect(
    evaluate("do exec x: foo.x, y: bar.y", {
      exec: ({ x, y }) => x + y,
      foo: { x: 8 },
      bar: { y: 2 },
    })
  ).toBe(10)
})

test("evaluates nested object properies function call", () => {
  expect(evaluate("do foo.bar.baz", { foo: { bar: { baz: () => 4 } } })).toBe(4)
})

test("evaluates function call when namespace is set", () => {
  expect(
    evaluate(
      "do ~exec",
      { foo: { bar: { exec: () => 4 } } },
      { namespaces: { "foo.bar": "~" } }
    )
  ).toBe(4)
})

test("evaluates function call with variable arguments when namespace is set", () => {
  expect(
    evaluate(
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
    evaluate(
      "do exec ~x, y",
      { exec: ({ x, y }) => x + y, foo: { bar: { x: 8 } }, y: 2 },
      { namespaces: { "foo.bar": "~" } }
    )
  ).toBe(10)
})

test("evaluates function call with nested shorthand variable arguments when namespace is set", () => {
  expect(
    evaluate(
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

test("evaluates function call with spread arguments applied", () => {
  expect(
    evaluate("do foo ...bar", { foo: ({ x, y }) => x + y, bar: { x: 1, y: 2 } })
  ).toBe(3)
})

test("evaluates function call with multiple spread arguments applied", () => {
  expect(
    evaluate("do foo ...bar, ...baz", {
      foo: ({ x, y }) => x + y,
      bar: { x: 1 },
      baz: { y: 2 },
    })
  ).toBe(3)
})

test("evaluates function call with multiple spread and regular arguments applied", () => {
  expect(
    evaluate("do foo ...bar, z: 5, ...baz", {
      foo: ({ x, y, z }) => x + y + z,
      bar: { x: 1 },
      baz: { y: 2 },
    })
  ).toBe(8)
})

test("evaluates function call with spread arguments applied and spaces around", () => {
  expect(
    evaluate("do foo    ...bar    ", {
      foo: ({ x, y }) => x + y,
      bar: { x: 1, y: 2 },
    })
  ).toBe(3)
})

test("evaluates function call with spread path arguments applied", () => {
  expect(
    evaluate(
      "do exec ...~bar.baz",
      { exec: ({ x, y }) => x + y, foo: { bar: { baz: { x: 1, y: 2 } } } },
      { namespaces: { foo: "~" } }
    )
  ).toBe(3)
})

test("evaluates function call with spread namespaced arguments applied", () => {
  expect(
    evaluate(
      "do exec ...~baz",
      { exec: ({ x, y }) => x + y, foo: { bar: { baz: { x: 1, y: 2 } } } },
      { namespaces: { "foo.bar": "~" } }
    )
  ).toBe(3)
})

test("evaluates successfully with extra leading and trailing spaces", () => {
  expect(evaluate("    4      ")).toBe(4)
})

test("evaluates successfully function call with extra leading spaces in the first argument", () => {
  expect(evaluate("do exec      x: 8", { exec: ({ x }) => x })).toBe(8)
})

test("evaluates successfully function call with arguments with extra spaces in between", () => {
  expect(
    evaluate("do exec x:   8,    y  : 2", { exec: ({ x, y }) => x + y })
  ).toBe(10)
})

test("evaluates successfully wildcard in the beginning of object path", () => {
  expect(
    evaluate("*.foo.bar", {
      x: { foo: { bar: 5 } },
      y: { foo: { bar: 7 } },
      z: { foo: 9 },
    })
  ).toBe({ x: 5, y: 7 })
})

test("evaluates successfully wildcard in the middle of object path", () => {
  expect(
    evaluate("foo.*.bar", {
      foo: { x: { bar: 4 }, y: { bar: 5 }, z: { baz: 9 } },
    })
  ).toBe({ x: 4, y: 5 })
})

test("evaluates successfully multiple wildcards in the middle of object path", () => {
  expect(
    evaluate("foo.*.*.bar", {
      foo: {
        a: { x: { bar: 4 }, y: { bar: 5 } },
        b: { z: { bar: 7 } },
        c: { baz: 10 },
      },
    })
  ).toBe({ a: { x: 4, y: 5 }, b: { z: 7 } })
})

test("evaluates successfully partial wildcard in the middle of object path", () => {
  expect(
    evaluate("foo.bar_*.baz", {
      foo: { bar_x: { baz: 4 }, bar_y: { baz: 5 }, bar_z: 5, x: { baz: 3 } },
    })
  ).toBe({ x: 4, y: 5 })
})

test("evaluates successfully wildcard in the end of object path", () => {
  expect(
    evaluate("foo.bar.*", { foo: { bar: { x: 1, y: 3, z: { a: 1 } } } })
  ).toBe({
    x: 1,
    y: 3,
    z: { a: 1 },
  })
})

test("evaluates successfully partial wildcard in the end of object path", () => {
  expect(
    evaluate("foo.bar.baz_*", {
      foo: { bar: { baz_x: 1, baz_y: 3, baz_z: { a: 1 }, z: 5 } },
    })
  ).toBe({
    x: 1,
    y: 3,
    z: { a: 1 },
  })
})

test("evaluates successfully wildcard on all properties of object path", () => {
  expect(evaluate("*.*.*", { foo: { bar: { x: 1, y: 5 } } })).toBe({
    foo: { bar: { x: 1, y: 5 } },
  })
})

test("evaluates successfully single wildcard", () => {
  expect(evaluate("*", { foo: { bar: { x: 1, y: 5 } } })).toBe({
    foo: { bar: { x: 1, y: 5 } },
  })
})

test("evaluates successfully multiple wildcards function calls in the middle of object path", () => {
  expect(
    evaluate("do foo.*.*.bar n: 10", {
      foo: {
        a: { x: { bar: ({ n }) => n + 4 }, y: { bar: ({ n }) => n + 5 } },
        b: { z: { bar: ({ n }) => n + 7 } },
        c: { baz: 10 },
      },
    })
  ).toBe({ a: { x: 14, y: 15 }, b: { z: 17 } })
})

test("evaluates successfully function definitions without parameters", () => {
  const fn = evaluate("-> do exec x: 1, y: 2", { exec: ({ x, y }) => x + y })

  expect(typeof fn).toBe("function")
  expect(fn()).toBe(3)
})

test("evaluates successfully function definitions without parameters and extra spaces", () => {
  const fn = evaluate("   -> do exec x: 1, y: 2", { exec: ({ x, y }) => x + y })

  expect(typeof fn).toBe("function")
  expect(fn()).toBe(3)
})

test("evaluates successfully function definitions with single parameter", () => {
  const fn = evaluate("x -> do exec x, y: 2", { exec: ({ x, y }) => x + y })

  expect(typeof fn).toBe("function")
  expect(fn({ x: 3 })).toBe(5)
})

test("evaluates successfully function definitions with single parameter and extra spaces", () => {
  const fn = evaluate("    x      -> do exec x, y: 2", {
    exec: ({ x, y }) => x + y,
  })

  expect(typeof fn).toBe("function")
  expect(fn({ x: 3 })).toBe(5)
})

test("evaluates successfully function definitions with multiple parameters", () => {
  const fn = evaluate("x, y -> do exec x, y", { exec: ({ x, y }) => x + y })

  expect(typeof fn).toBe("function")
  expect(fn({ x: 3, y: 4 })).toBe(7)
})

test("evaluates successfully function definitions with multiple parameters and extra spaces", () => {
  const fn = evaluate("    x,      y       -> do exec x, y", {
    exec: ({ x, y }) => x + y,
  })

  expect(typeof fn).toBe("function")
  expect(fn({ x: 3, y: 4 })).toBe(7)
})

test("evaluates successfully function definitions with single parameter and result function fails", () => {
  const fn = evaluate("x -> do exec x, y", { exec: ({ x, y }) => [x, y] })

  expect(typeof fn).toBe("function")
  expect(() => fn({ x: 3, y: 4 })).toThrow("Variable is not defined")
})

test("evaluates successfully when function is returned", () => {
  expect(evaluate("foo", { foo: () => 7 })()).toBe(7)
})

test("fails on syntax errors", () => {
  expect(() => evaluate("error[]")).toThrow("Syntax error")
})

test("fails when variable not exist", () => {
  expect(() => evaluate("x")).toThrow("Variable is not defined")
})

test("fails to call a function when variable has wrong type", () => {
  expect(() => evaluate("do foo bar: 4", { foo: 2 })).toThrow(
    "Can not call non function type"
  )
})

test("fails to accept function call as argument", () => {
  expect(() =>
    evaluate("do exec x: do bar", { exec: () => 8, bar: () => 4 })
  ).toThrow("Syntax error")
})

test("fails when namespace is not defined", () => {
  expect(() => evaluate("~x", { foo: { bar: { x: 4 } } })).toThrow(
    "Namespace is not defined"
  )
})
