import { parse } from "../../struct"

test("parses function call with spread arguments applied", () => {
  expect(parse("do foo ...bar")).toEqual({
    type: "Call",
    callee: {
      type: "Identifier",
      name: ["foo"],
    },
    args: [
      {
        type: "spread",
        value: {
          type: "Identifier",
          name: ["bar"],
        },
      },
    ],
  })
})

test("parses function call with multiple spread arguments applied", () => {
  expect(parse("do foo ...bar, ...baz")).toEqual({
    type: "Call",
    callee: {
      type: "Identifier",
      name: ["foo"],
    },
    args: [
      {
        type: "spread",
        value: {
          type: "Identifier",
          name: ["bar"],
        },
      },
      {
        type: "spread",
        value: {
          type: "Identifier",
          name: ["baz"],
        },
      },
    ],
  })
})

test("parses function call with multiple spread and regular arguments applied", () => {
  expect(parse("do foo ...bar, z: 5, ...baz")).toEqual({
    type: "Call",
    callee: {
      type: "Identifier",
      name: ["foo"],
    },
    args: [
      {
        type: "spread",
        value: {
          type: "Identifier",
          name: ["bar"],
        },
      },
      {
        type: "key",
        name: "z",
        value: {
          type: "Literal",
          value: 5,
        },
      },
      {
        type: "spread",
        value: {
          type: "Identifier",
          name: ["baz"],
        },
      },
    ],
  })
})

test("parses function call with spread arguments applied and spaces around", () => {
  expect(parse("do foo    ...bar    ")).toEqual({
    type: "Call",
    callee: {
      type: "Identifier",
      name: ["foo"],
    },
    args: [
      {
        type: "spread",
        value: {
          type: "Identifier",
          name: ["bar"],
        },
      },
    ],
  })
})

test("parses function call with spread namespaced arguments applied", () => {
  expect(
    parse("do foo ...~c", {
      namespaces: { "a.b": "~" },
    })
  ).toEqual({
    type: "Call",
    callee: {
      type: "Identifier",
      name: ["foo"],
    },
    args: [
      {
        type: "spread",
        value: {
          type: "Identifier",
          name: ["a", "b", "c"],
        },
      },
    ],
  })
})

test("parses function call with spread namespaced path arguments applied", () => {
  expect(
    parse("do foo ...~b.c", {
      namespaces: { a: "~" },
    })
  ).toEqual({
    type: "Call",
    callee: {
      type: "Identifier",
      name: ["foo"],
    },
    args: [
      {
        type: "spread",
        value: {
          type: "Identifier",
          name: ["a", "b", "c"],
        },
      },
    ],
  })
})
