import { useQuery } from "urql"
import { keys } from "ramda"
import { useContext } from "react"
import * as engine from "packages/engine"
import { context } from "./"

export function Value({
  template,
  expression,
  expressions,
  constants,
  children,
}) {
  if (template) return ""

  const { commands } = useContext(context)
  const requests = evaluateMany(
    expression || expressions,
    createScope(commands, constants)
  )

  const [result] = useQuery({
    query: createQuery(requests),
  })

  if (!result.data) {
    return "Initial loading..."
  }

  const data = transformResponse(result.data)

  return !children
    ? data || null
    : children({ data, fetching: result.data.fetching })
}

// export function Template

// export function Effect({ expression }) {}

const createScope = (commands, constants) => ({
  funcs: {
    commands: commands.reduce(
      (acc, command) => ({ ...acc, [command.id]: args => [command.id, args] }),
      {}
    ),
  },
  constants,
})

const evaluateMany = (input, scope) =>
  input instanceof Array
    ? input.map(expression => engine.evaluate(expression, scope))
    : [engine.evaluate(input, scope)]

const createQuery = requests => {
  const body = requests.reduce(
    (acc, [commandId, args], i) =>
      acc +
      `res${i}: readCommand(commandId: "${commandId}"${
        args ? `, args: ${stringifyArgs(args)}` : ""
      })`,
    ""
  )

  return `
    query {
      ${body}
    }
  `
}

const stringifyArgs = args => JSON.stringify(args).replace(/"([^"]+)":/g, "$1:")

const transformResponse = data => {
  const result = []

  for (let key of keys(data)) {
    const regex = /^res/
    if (!regex.test(key)) continue

    const i = key.replace(regex, "")
    result[i] = data[key]
  }

  return result
}
