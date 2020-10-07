import { evaluate } from "../../"

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

test("evaluates function call with spread namespaced path arguments applied", () => {
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
