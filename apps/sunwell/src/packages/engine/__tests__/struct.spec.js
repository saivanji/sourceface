import { parse, Literal, Constant, Call, Definition } from "../struct"

test("parses number", () => {
  expect(parse("4")).toEqual(new Literal(4))
})

test("parses with extra spaces around", () => {
  expect(parse("     4    ")).toEqual(new Literal(4))
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

test("parses function call with spread arguments applied", () => {
  expect(parse("do foo ...bar")).toEqual(
    new Call(["foo"], {
      "...": [new Constant(["bar"])],
    })
  )
})
test("parses function call with multiple spread arguments applied", () => {
  expect(parse("do foo ...bar, ...baz")).toEqual(
    new Call(["foo"], {
      "...": [new Constant(["bar"]), new Constant(["baz"])],
    })
  )
})
test("parses function call with multiple spread and regular arguments applied", () => {
  expect(parse("do foo ...bar, z: 5, ...baz")).toEqual(
    new Call(["foo"], {
      z: new Literal(5),
      "...": [new Constant(["bar"]), new Constant(["baz"])],
    })
  )
})
test("parses function call with spread arguments applied and spaces around", () => {
  expect(parse("do foo    ...bar    ")).toEqual(
    new Call(["foo"], {
      "...": [new Constant(["bar"])],
    })
  )
})
test("parses function call with spread namespaced arguments applied", () => {
  expect(
    parse("do foo ...~c", {
      namespaces: { "a.b": "~" },
    })
  ).toEqual(
    new Call(["foo"], {
      "...": [new Constant(["a", "b", "c"])],
    })
  )
})
test("parses function call with spread namespaced path arguments applied", () => {
  expect(
    parse("do foo ...~b.c", {
      namespaces: { a: "~" },
    })
  ).toEqual(
    new Call(["foo"], {
      "...": [new Constant(["a", "b", "c"])],
    })
  )
})

test("parses successfully function definition returning literal", () => {
  expect(parse("-> 5")).toEqual(new Definition(new Literal(5)))
})

test("parses successfully function definition returning constant", () => {
  expect(parse("-> foo")).toEqual(new Definition(new Constant(["foo"])))
})

test("parses successfully function definition without parameters", () => {
  expect(parse("-> do foo x: 1, y: 2")).toEqual(
    new Definition(new Call(["foo"], { x: new Literal(1), y: new Literal(2) }))
  )
})

test("parses successfully function definitions without parameters and extra spaces", () => {
  expect(parse("   -> do foo x: 1, y: 2")).toEqual(
    new Definition(new Call(["foo"], { x: new Literal(1), y: new Literal(2) }))
  )
})

test("parses successfully function definitions with single parameter", () => {
  expect(parse("x -> do foo x, y: 2")).toEqual(
    new Definition(
      new Call(["foo"], { x: new Constant(["x"]), y: new Literal(2) }),
      ["x"]
    )
  )
})

test("parses successfully function definitions with single parameter and extra spaces", () => {
  expect(parse("    x      -> do foo x, y: 2")).toEqual(
    new Definition(
      new Call(["foo"], { x: new Constant(["x"]), y: new Literal(2) }),
      ["x"]
    )
  )
})

test("parses successfully function definitions with multiple parameters", () => {
  expect(parse("x, y -> do foo x, y")).toEqual(
    new Definition(
      new Call(["foo"], { x: new Constant(["x"]), y: new Constant(["y"]) }),
      ["x", "y"]
    )
  )
})

test("parses successfully function definitions with multiple parameters and extra spaces", () => {
  expect(parse("    x,      y       -> do foo x, y")).toEqual(
    new Definition(
      new Call(["foo"], { x: new Constant(["x"]), y: new Constant(["y"]) }),
      ["x", "y"]
    )
  )
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
    parse("~a.b.c", {
      namespaces: { "foo.bar": "~" },
    })
  ).toEqual(new Constant(["foo", "bar", "a", "b", "c"]))
})

test("parses namespaced nested constant with wildcard", () => {
  expect(
    parse("~a.*.c", {
      namespaces: { "foo.bar": "~" },
    })
  ).toEqual(new Constant(["foo", "bar", "a", "*", "c"]))
})

test("parses namespaced nested function call", () => {
  expect(
    parse("do ~baz", {
      namespaces: { "foo.bar": "~" },
    })
  ).toEqual(new Call(["foo", "bar", "baz"]))
})

test("parses namespaced nested function call", () => {
  expect(
    parse("do ~a.b.c", {
      namespaces: { "foo.bar": "~" },
    })
  ).toEqual(new Call(["foo", "bar", "a", "b", "c"]))
})

test("parses function call with namespaces argument", () => {
  expect(
    parse("do a.b.c x: ~baz", {
      namespaces: { "foo.bar": "~" },
    })
  ).toEqual(
    new Call(["a", "b", "c"], {
      x: new Constant(["foo", "bar", "baz"]),
    })
  )
})

test("parses nested function call with namespaces argument", () => {
  expect(
    parse("do a.b.c ~baz.x", {
      namespaces: { "foo.bar": "~" },
    })
  ).toEqual(
    new Call(["a", "b", "c"], {
      x: new Constant(["foo", "bar", "baz", "x"]),
    })
  )
})
