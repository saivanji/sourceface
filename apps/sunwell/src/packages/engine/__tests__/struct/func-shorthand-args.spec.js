import { parse, Constant, Call } from "../../struct"

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
