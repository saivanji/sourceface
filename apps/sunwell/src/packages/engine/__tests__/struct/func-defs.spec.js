import { parse, Literal, Constant, Call, Definition } from "../../struct"

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
