import React, { useState, useEffect, useCallback, useContext } from "react"
import axios from "axios"
import * as runtime from "../runtime"
import { context } from "../"

export default ({ children, input, scope, pause }) => {
  const [value, setValue] = useState()
  const [loading, setLoading] = useState(false)
  const { queries } = useContext(context)
  const exec = useCallback(async () => {
    setLoading(true)
    setValue(
      await execMany(
        input,
        provideScope(
          queries.map(q => q.id),
          scope
        )
      )
    )
    setLoading(false)
  }, [input])

  useEffect(() => {
    if (!pause) exec()
  }, [pause, exec])

  if (!value) {
    return "Loading..."
  }

  return !children ? value || null : children({ value, exec, loading })
}

const execMany = (input, scope) =>
  input instanceof Array
    ? Promise.all(input.map(value => runtime.exec(value, scope)))
    : runtime.exec(input, scope)

const provideScope = (queries, scope) => ({
  ...scope,
  queries: queries.reduce(
    (acc, name) => ({
      ...acc,
      [name]: query(name),
    }),
    {}
  ),
})

const query = name => async args => {
  const { res } = await graphql(
    `mutation ($args: JSONObject) {
      res: executeQuery(queryId: "${name}", args: $args)
    }`,
    { args }
  )

  return res
}

const graphql = async (query, variables) => {
  const res = await axios.post(
    "http://localhost:5001/graphql",
    {
      query,
      variables,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  )

  return res.data.data
}
