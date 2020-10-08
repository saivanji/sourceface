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

