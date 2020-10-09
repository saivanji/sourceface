import { Call, Member } from "./semantics"

// TODO: have Program type which will always be root of a tree?

export default {
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
      fn: Call.callee,
      name: "Member",
    },
    {
      type: "repeat",
      optional: true,
      fn: Call.args,
      separator: { type: "token", name: "Punctuator", value: "," },
      item: {
        type: "or",
        items: [
          [
            {
              type: "token",
              fn: Call.key,
              name: "Identifier",
            },
            { type: "token", name: "Punctuator", value: ":" },
            {
              type: "or",
              fn: Call.value,
              items: [
                { type: "structure", name: "Member" },
                { type: "structure", name: "Literal" },
              ],
            },
          ],
          {
            type: "structure",
            fn: Call.shorthand,
            name: "Member",
          },
          [
            { type: "token", name: "Punctuator", value: "..." },
            {
              type: "structure",
              fn: Call.spread,
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
      fn: Member.prefix,
      optional: true,
      name: "Punctuator",
      value: ["~", "#"],
    },
    {
      type: "repeat",
      separator: { type: "token", name: "Punctuator", value: "." },
      item: {
        type: "or",
        fn: Member.node,
        items: [
          {
            type: "token",
            name: "Identifier",
          },
          {
            type: "token",
            name: "Punctuator",
            value: "*",
          },
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
