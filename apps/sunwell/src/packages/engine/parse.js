// TODO: if function result is the same as result of identifier and literal then logically it can be given to another function arguments(since identifiers and literals could). Think how to restrict that. Make function higher abstraction than identifiers and literals. Find similar example in js tokenisation.(object definition at a program root)

// TODO: a.b.c is not identifier, choose another name for it
/**
 * Code syntax analysis and parsing to a data structure.
 */
export const parse = (tokens, options) => {}

export class SyntaxError extends Error {}

// tokenize - LexicalError
// parse - SyntaxError
// execute - TypeError/ReferenceError/EvaluationError/ExecutionError?

// TODO: next step after grammar is semantics
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
    },
    {
      type: "repeat",
      separator: { type: "token", name: "Punctuator", value: "," },
      item: {
        type: "or",
        items: [
          [
            { type: "token", name: "Identifier" },
            { type: "token", name: "Punctuator", value: ":" },
            {
              type: "or",
              items: [
                { type: "structure", name: "Member" },
                { type: "structure", name: "Literal" },
              ],
            },
          ],
          { type: "structure", name: "Member" },
          [
            { type: "token", name: "Punctuator", value: "..." },
            { type: "structure", name: "Member" },
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
