import React, { useState, useEffect, useCallback, useContext } from "react"
import { useClient } from "urql"
import * as runtime from "../runtime"
import { context } from "../"

// TODO: abstract execution from loading component?
export default ({ children, input, scope, pause }) => {
  const [value, setValue] = useState()
  const [loading, setLoading] = useState(false)
  const { commands } = useContext(context)
  const client = useClient()
  const exec = useCallback(async () => {
    setLoading(true)
    setValue(
      await execMany(
        input,
        provideScope(
          commands.map(q => q.id),
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

const provideScope = (commands, scope, client) => ({
  ...scope,
  commands: commands.reduce(
    (acc, name) => ({
      ...acc,
      [name]: command(name, client),
    }),
    {}
  ),
})

const command = (name, client) => async args => {
  const {
    data: { res },
  } = await client
    .query(
      `mutation ($args: JSONObject) {
        res: executeCommand(commandId: "${name}", args: $args)
      }`,
      { args }
    )
    .toPromise()

  return res
}
