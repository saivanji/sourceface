import React from "react"
import { useQuery } from "urql"
import { exec, parseExpression, getVariables } from "../../runtime"

export default ({
  config,
  /* t: Template, e: Expression */
}) => {
  config.value =
    "`Hello ${queries.countOrders().count + queries.countOrders().count + queries.countOrders().count} : ${queries.countOrders().count} : ${queries.countOrders({a: 1, b: 2}).count}`"

  return (
    <Expression input={config.value}>
      {({ send, value }) => value || <button onClick={send}>Send</button>}
    </Expression>
  )
}

const Expression = ({ children, input, pause }) => {
  const variables = getVariables(parseExpression(input))
  console.log(variables)
  // unique queries without duplicates(name + args)
  const queries = [["countOrders", { a: 1, b: 2 }], ["countOrders"]]

  const [response, send] = useQuery({
    query: graphqlRequest(queries),
    pause,
  })

  if (!response.data && response.fetching) return "Loading..."

  if (response.error) return "Error"

  const value =
    response.data &&
    exec(input, {
      queries: passQueries(response.data, queries),
    })

  return children
    ? children({ value, send, fetching: response.fetching })
    : value || false
}

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
