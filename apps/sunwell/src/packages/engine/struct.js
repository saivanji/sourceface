// TODO: if function result is the same as result of identifier and literal then logically it can be given to another function arguments(since identifiers and literals could). Think how to restrict that. Make function higher abstraction than identifiers and literals. Find similar example in js tokenisation.(object definition at a program root)

export const tokenize = input => {}

// TODO: a.b.c is not identifier, choose another name for it
/**
 * Syntax code analysis and parsing to a structure.
 */
export const parse = (input, options) => {}

//
// tokenize - LexicalError
// syntax validation - SyntaxError
// parse - ?
// execute - TypeError/ReferenceError/EvaluationError/ExecutionError?
