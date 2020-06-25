import React from "react"
import { useQuery } from "urql"
import { render, stringify } from "../../processing"

// what if all evaluation will happen on server side?
// instead of executeQuery, have "renderTemplate", and "evaluate" queries
// will not work, since we need to execute some code on a client side, such as redirect and state related functions

export default ({
  config,
  /* t: Template, e: Expression */
}) => {
  config.value = "Hello {{ queries.countOrders({a: 1, b: 2}).count }}"

  return <Template value={config.value}>{result => result}</Template>
}

// TODO: parse input with esprima
const Template = ({ children, value }) => {
  // unique queries without duplicates(name + args)
  const queries = [
    ["countOrders", { a: 1, b: 2 }],
    ["countOrders", { a: 2, b: 2 }],
  ]

  const query = graphqlRequest(queries)

  const [result] = useQuery({
    query,
  })

  if (!result.data) return "Loading..."

  if (result.error) return "Error"

  console.log(passQueries2(result.data, queries))

  return render(value, {
    queries: passQueries(result.data, queries),
  })
}

const passQueries2 = (res, queries) => {
  const withArgs = queries.reduce(
    (acc, [name, args], i) => ({
      ...acc,
      [name]: {
        ...acc[name],
        [JSON.stringify(args)]: JSON.stringify(res[`i${i}`]),
      },
    }),
    {}
  )

  return Object.keys(withArgs).reduce((acc, name) => {
    const argsList = withArgs[name]

    const all = JSON.stringify(argsList)

    console.log(`${all}[JSON.stringify(args)]`)

    return {
      ...acc,
      [name]: new Function("args", `${all}[JSON.stringify(args)]`),
    }
  }, {})
}

// TODO: handle same queries with different args
const passQueries = (res, queries) =>
  queries.reduce(
    (acc, [name, args], i) => ({
      ...acc,
      [name]: new Function(`return ${stringify(res[`i${i}`])}`),
    }),
    {}
  )

const graphqlRequest = queries => {
  const body = queries.reduce(
    (acc, [name, args], i) =>
      acc +
      `i${i}: executeQuery(queryId: "${name}"${
        args && `, args: ${JSON.stringify(args).replace(/"([^"]+)":/g, "$1:")}`
      })`,
    ""
  )

  return `
    mutation {
      ${body}
    }
  `
}
