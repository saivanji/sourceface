import parse from "../../parse"

test("parses successfully function definition returning literal", () => {
  expect(parse("-> 5")).toEqual({
    type: "Definition",
    body: { type: "Literal", value: 4 },
  })
})

test("parses successfully function definition returning constant", () => {
  expect(parse("-> foo")).toEqual({
    type: "Definition",
    body: { type: "Member", name: ["foo"] },
  })
})

test("parses successfully function definition without parameters", () => {
  expect(parse("-> do foo x: 1, y: 2")).toEqual({
    type: "Definition",
    body: {
      type: "Call",
      callee: { type: "Member", name: ["foo"] },
      args: [
        {
          type: "key",
          name: "x",
          value: {
            type: "Literal",
            value: 1,
          },
        },
        {
          type: "key",
          name: "y",
          value: {
            type: "Literal",
            value: 2,
          },
        },
      ],
    },
  })
})

test("parses successfully function definitions without parameters and extra spaces", () => {
  expect(parse("   -> do foo x: 1, y: 2")).toEqual({
    type: "Definition",
    body: {
      type: "Call",
      callee: { type: "Member", name: ["foo"] },
      args: [
        {
          type: "key",
          name: "x",
          value: {
            type: "Literal",
            value: 1,
          },
        },
        {
          type: "key",
          name: "y",
          value: {
            type: "Literal",
            value: 2,
          },
        },
      ],
    },
  })
})

test("parses successfully function definitions with single parameter", () => {
  expect(parse("x -> do foo x, y: 2")).toEqual({
    type: "Definition",
    params: ["x"],
    body: {
      type: "Call",
      callee: { type: "Member", name: ["foo"] },
      args: [
        {
          type: "key",
          name: "x",
          value: { type: "Member", name: ["x"] },
        },
        {
          type: "key",
          name: "y",
          value: {
            type: "Literal",
            value: 2,
          },
        },
      ],
    },
  })
})

test("parses successfully function definitions with single parameter and extra spaces", () => {
  expect(parse("    x      -> do foo x, y: 2")).toEqual({
    type: "Definition",
    params: ["x"],
    body: {
      type: "Call",
      callee: { type: "Member", name: ["foo"] },
      args: [
        {
          type: "key",
          name: "x",
          value: { type: "Member", name: ["x"] },
        },
        {
          type: "key",
          name: "y",
          value: {
            type: "Literal",
            value: 2,
          },
        },
      ],
    },
  })
})

test("parses successfully function definitions with multiple parameters", () => {
  expect(parse("x, y -> do foo x, y")).toEqual({
    type: "Definition",
    params: ["x", "y"],
    body: {
      type: "Call",
      callee: { type: "Member", name: ["foo"] },
      args: [
        {
          type: "key",
          name: "x",
          value: {
            type: "Member",
            name: ["x"],
          },
        },
        {
          type: "key",
          name: "y",
          value: {
            type: "Member",
            name: ["y"],
          },
        },
      ],
    },
  })
})

test("parses successfully function definitions with multiple parameters and extra spaces", () => {
  expect(parse("    x,      y       -> do foo x, y")).toEqual({
    type: "Definition",
    params: ["x", "y"],
    body: {
      type: "Call",
      callee: { type: "Member", name: ["foo"] },
      args: [
        {
          type: "key",
          name: "x",
          value: {
            type: "Member",
            name: ["x"],
          },
        },
        {
          type: "key",
          name: "y",
          value: {
            type: "Member",
            name: ["y"],
          },
        },
      ],
    },
  })
})
