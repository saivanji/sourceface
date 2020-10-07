import { parse, Literal, Constant, Call, Definition } from "../struct"

test("parses number", () => {
  expect(parse("4")).toEqual(new Literal(4))
})

test("parses constant", () => {
  expect(parse("foo")).toEqual(new Constant(["foo"]))
})

test("parses nested constant", () => {
  expect(parse("foo.bar.baz")).toEqual(new Constant(["foo", "bar", "baz"]))
})

test("parses nested constant with wildcard", () => {
  expect(parse("foo.*.bar")).toEqual(new Constant(["foo", "*", "bar"]))
})

test("parses namespaced constant", () => {
  expect(
    parse("~baz", {
      namespaces: { "foo.bar": "~" },
    })
  ).toEqual(new Constant(["foo", "bar", "baz"]))
})

test("parses namespaced nested constant", () => {
  expect(
    parse("a.b.c", {
      namespaces: { "foo.bar": "~" },
    })
  ).toEqual(new Constant(["foo", "bar", "a", "b", "c"]))
})

test("parses namespaced nested constant with wildcard", () => {
  expect(
    parse("a.*.c", {
      namespaces: { "foo.bar": "~" },
    })
  ).toEqual(new Constant(["foo", "bar", "a", "*", "c"]))
})

test("parses function call without arguments", () => {
  expect(parse("do foo")).toEqual(new Call(["foo"]))
})

test("parses nested function call without arguments", () => {
  expect(parse("do foo.bar.baz")).toEqual(new Call(["foo", "bar", "baz"]))
})

test("parses function call with arguments", () => {
  expect(parse("do foo x: 1, y: 2")).toEqual(
    new Call(["foo"], { x: new Literal(1), y: new Literal(2) })
  )
})

test("parses function call with constant arguments", () => {
  expect(parse("do foo x: a, y: b")).toEqual(
    new Call(["foo"], { x: new Constant(["a"]), y: new Constant(["b"]) })
  )
})

test("parses function call with shorthand arguments", () => {
  expect(parse("do foo x, y")).toEqual(
    new Call(["foo"], { x: new Constant(["x"]), y: new Constant(["y"]) })
  )
})

test("parses function call with nested shorthand arguments", () => {
  expect(parse("do foo a.x, b.y")).toEqual(
    new Call(["foo"], {
      x: new Constant(["a", "x"]),
      y: new Constant(["b", "y"]),
    })
  )
})
