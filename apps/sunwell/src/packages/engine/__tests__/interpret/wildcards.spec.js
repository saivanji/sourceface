import { evaluate } from "../"

test("evaluates successfully wildcard in the beginning of object path", () => {
  expect(
    evaluate("*.foo.bar", {
      x: { foo: { bar: 5 } },
      y: { foo: { bar: 7 } },
      z: { foo: 9 },
    })
  ).toEqual({ x: 5, y: 7 })
})

test("evaluates successfully wildcard in the middle of object path", () => {
  expect(
    evaluate("foo.*.bar", {
      foo: { x: { bar: 4 }, y: { bar: 5 }, z: { baz: 9 } },
    })
  ).toEqual({ x: 4, y: 5 })
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
  ).toEqual({ a: { x: 4, y: 5 }, b: { z: 7 } })
})

test("evaluates successfully leading partial wildcard in the middle of object path", () => {
  expect(
    evaluate("foo.bar_*.baz", {
      foo: { bar_x: { baz: 4 }, bar_y: { baz: 5 }, bar_z: 5, x: { baz: 3 } },
    })
  ).toEqual({ x: 4, y: 5 })
})

test("evaluates successfully trailing partial wildcard in the middle of object path", () => {
  expect(
    evaluate("foo.*_bar.baz", {
      foo: { x_bar: { baz: 4 }, y_bar: { baz: 5 }, z_bar: 5, x: { baz: 3 } },
    })
  ).toEqual({ x: 4, y: 5 })
})

test("evaluates successfully surrounded partial wildcard in the middle of object path", () => {
  expect(
    evaluate("foo.a_*_bar.baz", {
      foo: {
        a_x_bar: { baz: 4 },
        a_y_bar: { baz: 5 },
        a_z_bar: 5,
        x: { baz: 3 },
      },
    })
  ).toEqual({ x: 4, y: 5 })
})

test("evaluates successfully wildcard in the end of object path", () => {
  expect(
    evaluate("foo.bar.*", { foo: { bar: { x: 1, y: 3, z: { a: 1 } } } })
  ).toEqual({
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
  ).toEqual({
    x: 1,
    y: 3,
    z: { a: 1 },
  })
})

test("evaluates successfully wildcard on all properties of object path", () => {
  expect(evaluate("*.*.*", { foo: { bar: { x: 1, y: 5 } } })).toEqual({
    foo: { bar: { x: 1, y: 5 } },
  })
})

test("evaluates successfully single wildcard", () => {
  expect(evaluate("*", { foo: { bar: { x: 1, y: 5 } } })).toEqual({
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
  ).toEqual({ a: { x: 14, y: 15 }, b: { z: 17 } })
})

test("evaluates successfully wildcards in function arguments", () => {
  expect(
    evaluate("do foo x: bar.baz_*.y", {
      foo: ({ x }) => x.a + 3,
      bar: {
        baz_a: {
          y: 5,
          z: 7,
        },
        baz_b: {
          y: 4,
          z: 2,
        },
      },
    })
  ).toBe(8)
})

test("fails when variable not exist while accessing wildcard nested object prop during function call", () => {
  expect(() => evaluate("do x.y.*.*.z.foo")).toThrow("Variable is not defined")
})

test("fails when variable not exist while accessing wildcard nested object prop", () => {
  expect(() => evaluate("x.y.z.*.*.foo.bar")).toThrow("Variable is not defined")
})

test("fails when wildcard object property not exist", () => {
  expect(() => evaluate("x.*.z", { x: { foo: 1 } })).toThrow(
    "Variable is not defined"
  )
})
