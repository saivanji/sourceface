import { useState, useEffect, useCallback, useContext } from "react"
import { useClient } from "urql"
import * as runtime from "packages/runtime"
import { context } from "./"

// TODO: have QueryExpression and Mutation expression?
// TODO: abstract execution from loading component?
export default ({ children, input, scope, pause }) => {
  const [value, setValue] = useState()
  const [loading, setLoading] = useState(false)
  const { commands } = useContext(context)
  const client = useClient()
  const evaluate = useCallback(async () => {
    setLoading(true)
    setValue(
      await evaluateMany(
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
    if (!pause) evaluate()
  }, [pause, evaluate])

  if (!value) {
    return "Loading..."
  }

  return !children ? value || null : children({ value, evaluate, loading })
}

const evaluateMany = (input, scope) =>
  input instanceof Array
    ? Promise.all(input.map(value => runtime.evaluate(value, scope)))
    : runtime.evaluate(input, scope)

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
    // TODO: should we have different queries/mutations depending on command type? So graphql clients could properly cache results on queries
    .query(
      `query ($args: JSONObject) {
        res: readCommand(commandId: "${name}", args: $args)
      }`,
      { args }
    )
    .toPromise()

  return res
}
