import { parse } from "../../struct"

test("parses function call with shorthand arguments", () => {
  expect(parse("do foo x, y")).toEqual({
    type: "Call",
    callee: {
      type: "Identifier",
      name: ["foo"],
    },
    args: [
      {
        type: "key",
        name: "x",
        value: {
          type: "Identifier",
          name: ["x"],
        },
      },
      {
        type: "key",
        name: "y",
        value: {
          type: "Identifier",
          name: ["y"],
        },
      },
    ],
  })
})

test("parses function call with nested shorthand arguments", () => {
  expect(parse("do foo a.x, b.y")).toEqual({
    type: "Call",
    callee: {
      type: "Identifier",
      name: ["foo"],
    },
    args: [
      {
        type: "key",
        name: "x",
        value: {
          type: "Identifier",
          name: ["a", "x"],
        },
      },
      {
        type: "key",
        name: "y",
        value: {
          type: "Identifier",
          name: ["b", "y"],
        },
      },
    ],
  })
})
