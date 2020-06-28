import React, { useState, useEffect, useCallback, useContext } from "react"
import { useClient } from "urql"
import * as runtime from "../runtime"
import { context } from "../"

// TODO: abstract execution from loading component?
export default ({ children, input, scope, pause }) => {
  const [value, setValue] = useState()
  const [loading, setLoading] = useState(false)
  const { queries } = useContext(context)
  const client = useClient()
  const exec = useCallback(async () => {
    setLoading(true)
    setValue(
      await execMany(
        input,
        provideScope(
          queries.map(q => q.id),
          scope,
          client
        )
      )
    )
    setLoading(false)
  }, [input, scope])

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

const provideScope = (queries, scope, client) => ({
  ...scope,
  queries: queries.reduce(
    (acc, name) => ({
      ...acc,
      [name]: query(name, client),
    }),
    {}
  ),
})

const query = (name, client) => async args => {
  const {
    data: { res },
  } = await client
    .query(
      `mutation ($args: JSONObject) {
        res: executeQuery(queryId: "${name}", args: $args)
      }`,
      { args }
    )
    .toPromise()

  return res
}
