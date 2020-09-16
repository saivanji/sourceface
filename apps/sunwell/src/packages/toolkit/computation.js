import { useQuery } from "urql"
import { keys } from "ramda"
import * as engine from "packages/engine"
import * as template from "packages/template"
import { useScope, useIdentity } from "./container"

// TODO: rename commands to queries completely

/**
 * Computing expression. Type could be either "expression" or "template"
 */
export function Compute({ type = "expression", input, children }) {
  const isArray = input instanceof Array

  const expressions =
    type === "expression" ? (isArray ? input : [input]) : template.parse(input)

  const [data, { fetching }] = useEvaluation(expressions)

  if (!data) {
    return "Initial loading..."
  }

  return children({
    data:
      type === "expression"
        ? isArray
          ? data
          : data[0]
        : template.replace(input, i => data[i]),
    fetching,
  })
}

// export function Effect({ expression }) {}

// TODO: in case expression return value has no commands, do not send request to server
const useEvaluation = input => {
  const id = useIdentity()
  const scope = useScope(id)
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

const evaluateOptions = { namespaces: { local: "~" } }

const evaluateMany = (expressions, scope) =>
  expressions.map(expression =>
    engine.evaluate(expression, scope, evaluateOptions)
  )

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
