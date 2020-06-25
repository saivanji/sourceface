import * as esprima from "esprima"

export const exec = (input, scope) => {
  const vars =
    scope &&
    Object.keys(scope)
      .reduce(
        (acc, key) => [...acc, `const ${key}=${stringify(scope[key])}`],
        []
      )
      .join(";")

  return eval(`${vars};${input}`)
}

// TODO: use recursive validation on types from getVariables in order to check on restricted things such as FunctionExpression inside of function arguments, array elements and so on.
export const validate = (node, input) => {
  const isProgram = node.type === "Program"

  if (
    isProgram &&
    (node.body.length !== 1 || node.body[0].type !== "ExpressionStatement")
  ) {
    return (
      "Failed to parse " +
      JSON.stringify(input) +
      ". Only expressions are allowed"
    )
  }

  const expression = isProgram ? node.body[0] : node

  if (expression.type === "AssignmentExpression") {
    return (
      "Failed to parse " +
      JSON.stringify(input) +
      ". Assignments are not allowed"
    )
  }

  if (expression.type === "AwaitExpression") {
    return "Failed to parse " + JSON.stringify(input) + ". Await is not allowed"
  }

  if (expression.type === "ClassExpression") {
    return (
      "Failed to parse " + JSON.stringify(input) + ". Classes are not allowed"
    )
  }

  if (expression.type === "NewExpression") {
    return (
      "Failed to parse " +
      JSON.stringify(input) +
      ". Classes instantiation is not allowed"
    )
  }

  if (expression.type === "FunctionExpression") {
    return (
      "Failed to parse " +
      JSON.stringify(input) +
      ". Function expressions are not allowed. Use arrow functions instead"
    )
  }

  if (expression.type === "SequenceExpression") {
    return (
      "Failed to parse " + JSON.stringify(input) + ". Sequences are not allowed"
    )
  }

  if (expression.type === "TaggedTemplateExpression") {
    return (
      "Failed to parse " +
      JSON.stringify(input) +
      ". Tagged templates are not allowed"
    )
  }

  if (expression.type === "ThisExpression") {
    return (
      "Failed to parse " + JSON.stringify(input) + ". 'this' is not allowed"
    )
  }

  if (expression.type === "UpdateExpression") {
    return (
      "Failed to parse " +
      JSON.stringify(input) +
      ". Update expression is not allowed"
    )
  }

  if (expression.type === "YieldExpression") {
    return (
      "Failed to parse " +
      JSON.stringify(input) +
      ". Generators are not allowed"
    )
  }
}

export const parseExpression = input => {
  return esprima.parse(input)
}

// resolve issue with deep member expressions(more than 2)?
export const getVariables = (expression, arr = []) => {
  if (
    expression.type === "Identifier" ||
    (expression.type === "MemberExpression" &&
      expression.object.type !== "CallExpression")
  )
    return [...arr, expression]

  if (expression.type === "Program")
    return getVariables(expression.body[0].expression, arr)

  if (
    expression.type === "MemberExpression" &&
    expression.object.type === "CallExpression"
  ) {
    return getVariables(expression.object, arr)
  }

  if (expression.type === "CallExpression") {
    return [
      ...getVariables(expression.callee, arr),
      ...expression.arguments.reduce((acc, arg) => getVariables(arg, acc), []),
    ]
  }

  if (expression.type === "ObjectExpression") {
    return [
      ...arr,
      ...expression.properties.reduce(
        (acc, prop) => getVariables(prop.value, acc),
        []
      ),
    ]
  }

  if (expression.type === "ArrayExpression") {
    return [
      ...arr,
      ...expression.elements.reduce(
        (acc, elem) =>
          getVariables(
            elem.type === "SpreadElement" ? elem.argument : elem,
            acc
          ),
        []
      ),
    ]
  }

  if (expression.type === "UnaryExpression") {
    return getVariables(expression.argument, arr)
  }

  if (expression.type === "TemplateLiteral") {
    return [
      ...arr,
      ...expression.expressions.reduce(
        (acc, expr) => getVariables(expr, acc),
        []
      ),
    ]
  }

  if (
    expression.type === "LogicalExpression" ||
    expression.type === "BinaryExpression"
  ) {
    return [
      ...arr,
      ...getVariables(expression.left),
      ...getVariables(expression.right),
    ]
  }

  if (expression.type === "ConditionalExpression") {
    return [
      ...arr,
      ...getVariables(expression.test),
      ...getVariables(expression.consequent),
      ...getVariables(expression.alternate),
    ]
  }

  if (expression.type === "ArrowFunctionExpression") {
    return getVariables(expression.body, arr)
  }

  return arr
}

const stringify = val =>
  typeof val === "function"
    ? val.toString()
    : typeof val === "object" && !(val instanceof Array)
    ? "{" +
      Object.keys(val).reduce(
        (acc, key) => acc + `${[JSON.stringify(key)]}: ${stringify(val[key])}`,
        ""
      ) +
      "}"
    : JSON.stringify(val)
