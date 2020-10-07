import { parse, Literal, Constant, Call } from "../../struct"

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
