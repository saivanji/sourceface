import { parse, Literal, Constant, Call } from "../../struct"

test("parses function call without arguments", () => {
  expect(parse("do foo")).toEqual(new Call(["foo"]))
})

test("parses function call without arguments and extra spaces", () => {
  expect(parse("   do       foo     ")).toEqual(new Call(["foo"]))
})

test("parses nested function call without arguments", () => {
  expect(parse("do foo.bar.baz")).toEqual(new Call(["foo", "bar", "baz"]))
})

test("parses function call with arguments", () => {
  expect(parse("do foo x: 1, y: 2")).toEqual(
    new Call(["foo"], { x: new Literal(1), y: new Literal(2) })
  )
})

test("parses function call with duplicated arguments", () => {
  expect(parse("do foo x: 1, x: 5, y: 2")).toEqual(
    new Call(["foo"], { x: new Literal(5), y: new Literal(2) })
  )
})

test("parses function call with arguments and extra spaces", () => {
  expect(parse("do    foo     x    :    1   ,   y  :    2  ")).toEqual(
    new Call(["foo"], { x: new Literal(1), y: new Literal(2) })
  )
})

test("parses function call with constant arguments", () => {
  expect(parse("do foo x: a, y: b")).toEqual(
    new Call(["foo"], { x: new Constant(["a"]), y: new Constant(["b"]) })
  )
})

test("parses function call with nested constant arguments", () => {
  expect(parse("do foo x: bar.a, y: bar.b")).toEqual(
    new Call(["foo"], {
      x: new Constant(["bar", "a"]),
      y: new Constant(["bar", "b"]),
    })
  )
})
