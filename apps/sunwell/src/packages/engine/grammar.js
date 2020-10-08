// TODO: next step after grammar is semantics
// import semantics here
const grammar = {
  Definition: [
    {
      type: "repeat",
      separator: { type: "token", name: "Punctuator", value: "," },
      item: { type: "token", name: "Identifier" },
    },
    {
      type: "token",
      name: "Punctuator",
      value: "->",
    },
    {
      type: "or",
      items: [
        { type: "structure", name: "Call" },
        { type: "structure", name: "Member" },
        { type: "structure", name: "Literal" },
      ],
    },
  ],
  Call: [
    {
      type: "token",
      name: "Keyword",
      value: "do",
    },
    {
      type: "structure",
      name: "Member",
      fn: (parent, callee) => ({ ...parent, callee }),
    },
    {
      type: "repeat",
      optional: true,
      fn: (parent, arg) => ({ ...parent, args: [...parent.args, arg] }),
      separator: { type: "token", name: "Punctuator", value: "," },
      item: {
        type: "or",
        items: [
          [
            {
              type: "token",
              fn: (parent, identifier) => ({
                ...parent,
                type: "key",
                name: identifier.value,
              }),
              name: "Identifier",
            },
            { type: "token", name: "Punctuator", value: ":" },
            {
              type: "or",
              fn: (parent, value) => ({ ...parent, value }),
              items: [
                { type: "structure", name: "Member" },
                { type: "structure", name: "Literal" },
              ],
            },
          ],
          {
            type: "structure",
            fn: (parent, value) => ({
              ...parent,
              type: "key",
              name: value.name.slice(-1),
              value,
            }),
            name: "Member",
          },
          [
            { type: "token", name: "Punctuator", value: "..." },
            {
              type: "structure",
              fn: (parent, value) => ({ ...parent, type: "spread", value }),
              name: "Member",
            },
          ],
        ],
      },
    },
  ],
  Member: [
    {
      type: "token",
      optional: true,
      name: "Punctuator",
      value: "~",
    },
    {
      type: "repeat",
      separator: { type: "token", name: "Punctuator", value: "." },
      item: {
        type: "or",
        items: [
          { type: "token", name: "Identifier" },
          { type: "token", name: "Punctuator", value: "*" },
        ],
      },
    },
  ],
  Literal: {
    type: "or",
    items: [
      { type: "token", name: "Numeric" },
      { type: "token", name: "String" },
      { type: "token", name: "Boolean" },
    ],
  },
}
