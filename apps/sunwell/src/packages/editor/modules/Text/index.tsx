import React from "react"
import * as esprima from "esprima"
import { useQuery } from "urql"
import { render, parseTemplate } from "../../processing"

// what if all evaluation will happen on server side?
// instead of executeQuery, have "renderTemplate", and "evaluate" queries
// will not work, since we need to execute some code on a client side, such as redirect and state related functions

// TODO: remplace template in favor of tagged templates

export default ({
  config,
  /* t: Template, e: Expression */
}) => {
  config.value =
    "Hello {{ queries.countOrders().count + queries.countOrders().count + queries.countOrders().count }} : {{ queries.countOrders().count }} : {{ queries.countOrders({a: 1, b: 2}).count }}"

  return <Template value={config.value} />
}

// TODO: parse input with esprima
const Template = ({ children, value }) => {
  /* console.log(parseTemplate(value)) */
  // unique queries without duplicates(name + args)
  const queries = [["countOrders", { a: 1, b: 2 }], ["countOrders"]]

  const [result] = useQuery({
    query: graphqlRequest(queries),
  })

  if (!result.data) return "Loading..."

  if (result.error) return "Error"

  const str = render(value, {
    queries: passQueries(result.data, queries),
  })

  return children ? children(str) : str
}

// TODO: return array without duplicates(template level)
const parseTemplateQueries = template => {}

// TODO: return array without duplicates(expression level)
const parseExpressionQueries = input => {
  // TODO: move that part under processing
  // along with recursing traversal?
  const parsed = esprima.parse(input)

  if (
    parsed.body.length !== 1 ||
    parsed.body[0].type !== "ExpressionStatement"
  ) {
    throw new Error(
      "Failed to parse " +
        JSON.stringify(input) +
        ". Only expressions are allowed"
    )
  }

  const { expression } = parsed.body[0]

  if (expression.type === "AssignmentExpression") {
    throw new Error(
      "Failed to parse " +
        JSON.stringify(input) +
        ". Assignments are not allowed"
    )
  }

  if (expression.type === "AwaitExpression") {
    throw new Error(
      "Failed to parse " + JSON.stringify(input) + ". Await is not allowed"
    )
  }

  if (expression.type === "ClassExpression") {
    throw new Error(
      "Failed to parse " + JSON.stringify(input) + ". Classes are not allowed"
    )
  }

  if (expression.type === "NewExpression") {
    throw new Error(
      "Failed to parse " +
        JSON.stringify(input) +
        ". Classes instantiation is not allowed"
    )
  }

  if (expression.type === "FunctionExpression") {
    throw new Error(
      "Failed to parse " +
        JSON.stringify(input) +
        ". Function expressions are not allowed. Use arrow functions instead"
    )
  }

  if (expression.type === "SequenceExpression") {
    throw new Error(
      "Failed to parse " + JSON.stringify(input) + ". Sequences are not allowed"
    )
  }

  if (expression.type === "TaggedTemplateExpression") {
    throw new Error(
      "Failed to parse " +
        JSON.stringify(input) +
        ". Tagged templates are not allowed"
    )
  }

  if (expression.type === "ThisExpression") {
    throw new Error(
      "Failed to parse " + JSON.stringify(input) + ". 'this' is not allowed"
    )
  }

  if (expression.type === "UpdateExpression") {
    throw new Error(
      "Failed to parse " +
        JSON.stringify(input) +
        ". Update expression is not allowed"
    )
  }

  if (expression.type === "YieldExpression") {
    throw new Error(
      "Failed to parse " +
        JSON.stringify(input) +
        ". Generators are not allowed"
    )
  }

  // TODO: use whitelist of accepted expression types

  return expression
}

console.log(parseExpressionQueries("queries.countorders()"))
console.log(
  parseExpressionQueries(
    "queries.countOrders({a: queries.countorders().count}).count"
  )
)
console.log(parseExpressionQueries("queries.countOrders().count"))
console.log(parseExpressionQueries("4"))
console.log(parseExpressionQueries("[...queries.countOrders().count]"))
console.log(parseExpressionQueries("typeof queries.countOrders().count"))
console.log(parseExpressionQueries("`${queries.countOrders().count}`"))
console.log(parseExpressionQueries("queries.countOrders().count || 1"))
console.log(parseExpressionQueries("a ? queries.countOrders().count : b"))
console.log(parseExpressionQueries("() => queries.countOrders().count"))
console.log(parseExpressionQueries("[queries.countOrders().count]"))
console.log(parseExpressionQueries("({a: queries.countOrders().count})"))
console.log(parseExpressionQueries("abc(queries.countOrders().count)"))
console.log(
  parseExpressionQueries(
    "queries.countOrders().count + queries.countOrders().count"
  )
)
console.log(
  parseExpressionQueries(
    "queries.countOrders().count + queries.countOrders().count + queries.countOrders().count"
  )
)

const passQueries = (res, queries) => {
  const map = queries.reduce(
    (acc, [name, args], i) => ({
      ...acc,
      [name]: {
        ...acc[name],
        [JSON.stringify(args)]: JSON.stringify(res[`i${i}`]),
      },
    }),
    {}
  )

  return Object.keys(map).reduce((acc, name) => {
    const all = `(${JSON.stringify(map[name])})`

    return {
      ...acc,
      [name]: new Function(
        "args",
        `return JSON.parse(${all}[JSON.stringify(args)])`
      ),
    }
  }, {})
}

const graphqlRequest = queries => {
  const body = queries.reduce(
    (acc, [name, args], i) =>
      acc +
      `i${i}: executeQuery(queryId: "${name}"${
        args
          ? `, args: ${JSON.stringify(args).replace(/"([^"]+)":/g, "$1:")}`
          : ""
      })`,
    ""
  )

  return `
    mutation {
      ${body}
    }
  `
}
