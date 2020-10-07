import { evaluate } from "../../"

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
