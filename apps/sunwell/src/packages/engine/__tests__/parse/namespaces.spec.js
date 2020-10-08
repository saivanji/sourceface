import parse from "../../parse"

test("parses namespaced constant", () => {
  expect(
    parse("~baz", {
      namespaces: { "foo.bar": "~" },
    })
  ).toEqual({ type: "Member", name: ["foo", "bar", "baz"] })
})

test("parses namespaced nested constant", () => {
  expect(
    parse("~a.b.c", {
      namespaces: { "foo.bar": "~" },
    })
  ).toEqual({ type: "Member", name: ["foo", "bar", "a", "b", "c"] })
})

test("parses namespaced nested constant with wildcard", () => {
  expect(
    parse("~a.*.c", {
      namespaces: { "foo.bar": "~" },
    })
  ).toEqual({ type: "Member", name: ["foo", "bar", "a", "*", "c"] })
})

test("parses namespaced nested function call", () => {
  expect(
    parse("do ~baz", {
      namespaces: { "foo.bar": "~" },
    })
  ).toEqual({
    type: "Call",
    callee: {
      type: "Member",
      name: ["foo", "bar", "baz"],
    },
  })
})

test("parses namespaced nested function call", () => {
  expect(
    parse("do ~a.b.c", {
      namespaces: { "foo.bar": "~" },
    })
  ).toEqual({
    type: "Call",
    callee: { type: "Member", name: ["foo", "bar", "a", "b", "c"] },
  })
})

test("parses function call with namespaces argument", () => {
  expect(
    parse("do a.b.c x: ~baz", {
      namespaces: { "foo.bar": "~" },
    })
  ).toEqual({
    type: "Call",
    callee: {
      type: "Member",
      name: ["a", "b", "c"],
    },
    args: [
      {
        type: "key",
        name: "x",
        value: {
          type: "Member",
          name: ["foo", "bar", "baz"],
        },
      },
    ],
  })
})

test("parses nested function call with namespaces argument", () => {
  expect(
    parse("do a.b.c ~baz.x", {
      namespaces: { "foo.bar": "~" },
    })
  ).toEqual({
    type: "Call",
    callee: {
      type: "Member",
      name: ["a", "b", "c"],
    },
    args: [
      {
        type: "key",
        name: "x",
        value: {
          type: "Member",
          name: ["foo", "bar", "baz", "x"],
        },
      },
    ],
  })
})
