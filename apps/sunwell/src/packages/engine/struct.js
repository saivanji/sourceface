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
