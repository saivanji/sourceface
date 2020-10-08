import parse from "../../parse"

test("parses function call without arguments", () => {
  expect(parse("do foo")).toEqual({
    type: "Call",
    callee: { type: "Member", name: ["foo"] },
  })
})

test("parses function call without arguments and extra spaces", () => {
  expect(parse("   do       foo     ")).toEqual({
    type: "Call",
    callee: { type: "Member", name: ["foo"] },
  })
})

test("parses nested function call without arguments", () => {
  expect(parse("do foo.bar.baz")).toEqual({
    type: "Call",
    callee: { type: "Member", name: ["foo", "bar", "baz"] },
  })
})

test("parses function call with single argument", () => {
  expect(parse("do foo x: 1")).toEqual({
    type: "Call",
    callee: {
      type: "Member",
      name: ["foo"],
    },
    args: [
      {
        type: "key",
        name: "x",
        value: {
          type: "Literal",
          value: 1,
        },
      },
    ],
  })
})

test("parses function call with multiple arguments", () => {
  expect(parse("do foo x: 1, y: 2")).toEqual({
    type: "Call",
    callee: {
      type: "Member",
      name: ["foo"],
    },
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
  })
})

test("parses function call with duplicated arguments", () => {
  expect(parse("do foo x: 1, x: 5, y: 2")).toEqual({
    type: "Call",
    callee: {
      type: "Member",
      name: ["foo"],
    },
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
        name: "x",
        value: {
          type: "Literal",
          value: 5,
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
  })
})

test("parses function call with arguments and extra spaces", () => {
  expect(parse("do    foo     x    :    1   ,   y  :    2  ")).toEqual({
    type: "Call",
    callee: {
      type: "Member",
      name: ["foo"],
    },
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
  })
})

test("parses function call with constant arguments", () => {
  expect(parse("do foo x: a, y: b")).toEqual({
    type: "Call",
    callee: {
      type: "Member",
      name: ["foo"],
    },
    args: [
      {
        type: "key",
        name: "x",
        value: {
          type: "Member",
          name: ["a"],
        },
      },
      {
        type: "key",
        name: "y",
        value: {
          type: "Member",
          name: ["b"],
        },
      },
    ],
  })
})

test("parses function call with nested constant arguments", () => {
  expect(parse("do foo x: bar.a, y: bar.b")).toEqual({
    type: "Call",
    callee: {
      type: "Member",
      name: ["foo"],
    },
    args: [
      {
        type: "key",
        name: "x",
        value: {
          type: "Member",
          name: ["bar", "a"],
        },
      },
      {
        type: "key",
        name: "y",
        value: {
          type: "Member",
          name: ["bar", "b"],
        },
      },
    ],
  })
})
