import React, { createContext, useContext } from "react"
import { useQuery } from "urql"
import { keys } from "ramda"
import * as engine from "packages/engine"

const context = createContext({})

// TODO: rename commands to queries completely
// TODO: rename QueriesProvider to ScopeProvider?
export function QueriesProvider({ queries, children }) {
  return <context.Provider value={queries}>{children}</context.Provider>
}

/**
 * Computing expression. Type could be either "expression" or "template"
 */
export function Compute({ type = "expression", input, constants, children }) {
  const expressions =
    type === "expression" ? input : engine.parseTemplate(input)

  const [data, { fetching }] = useEvaluation(expressions, constants)

  if (!data) {
    return "Initial loading..."
  }

  return children({
    data:
      type === "expression"
        ? input instanceof Array
          ? data
          : data[0]
        : engine.replaceTemplate(input, i => data[i]),
    fetching,
  })
}

// export function Effect({ expression }) {}

// TODO: in case expression return value has no commands, do not send request to server
const useEvaluation = (input, constants) => {
  const commands = useContext(context)
  const scope = createScope(commands, constants)
  const evaluated = evaluateMany(input, scope)

  if (evaluated.every(result => result.type !== "command")) {
    return [evaluated, { fetching: false }]
  }

  const [result] = useQuery({
    query: createQuery(evaluated),
  })

  return [
    result.data && provideData(evaluated, transformResponse(result.data)),
    { fetching: result.fetching },
  ]
}

const provideData = (evaluated, commandsData) =>
  evaluated.map((result, i) =>
    !result.type ? result : result.type === "command" && commandsData[i]
  )

// TODO: remove?
const createScope = (commands, constants) => ({
  funcs: {
    commands: commands.reduce(
      (acc, command) => ({
        ...acc,
        [command.id]: args => ({
          type: "command",
          payload: {
            commandId: command.id,
            args,
          },
        }),
      }),
      {}
    ),
  },
  constants,
})

const evaluateMany = (input, scope) =>
  input instanceof Array
    ? input.map(expression => engine.evaluate(expression, scope))
    : [engine.evaluate(input, scope)]

const createQuery = evaluated => {
  const body = evaluated.reduce(
    (acc, result, i) =>
      result.type !== "command"
        ? acc
        : acc +
          `res${i}: readCommand(commandId: "${result.payload.commandId}"${
            result.payload.args
              ? `, args: ${stringifyArgs(result.payload.args)}`
              : ""
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
  const result = {}

  for (let key of keys(data)) {
    // excluding __Typename
    const regex = /^res/
    if (!regex.test(key)) continue

    const i = key.replace(regex, "")
    result[i] = data[key]
  }

  return result
}
