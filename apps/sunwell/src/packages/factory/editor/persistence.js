import { useState } from "react"
import { toPairs, isNil } from "ramda"
import deepDiff from "deep-diff"
import { client } from "packages/client"
import reducer, { init } from "./reducer"

export const useSave = (initialPage, state, onSuccess) => {
  const [isSaving, setSaving] = useState(false)
  const save = async () => {
    const initialState = reducer(init(initialPage), {})
    const mutations = structure(createChanges(initialState, state))

    setSaving(true)
    await send(mutations)
    setSaving(false)

    onSuccess()
  }

  return [isSaving, save]
}

const definitions = {
  createModule: [
    {
      moduleId: "UUID",
      layoutId: "UUID",
      type: "ModuleType",
      name: "String",
      config: "JSONObject",
      position: "JSONObject",
    },
    ["id", "type", "name", "config"],
  ],
  updateModule: [
    {
      moduleId: "UUID",
      name: "String",
      config: "JSONObject",
    },
    ["id", "name", "config"],
  ],
  removeModule: [
    {
      moduleId: "UUID",
    },
  ],
  createAction: [
    {
      actionId: "UUID",
      moduleId: "UUID",
      order: "Int",
      field: "String",
      type: "ActionType",
      name: "String",
      config: "JSONObject",
      relations: "JSONObject",
    },
    ["id", "order", "field", "type", "name", "config", "relations"],
  ],
  updateAction: [
    {
      actionId: "UUID",
      name: "String",
      config: "JSONObject",
      relations: "JSONObject",
    },
    ["id", "name", "config", "relations"],
  ],
  removeAction: [
    {
      actionId: "UUID",
    },
  ],
  updateLayout: [
    {
      layoutId: "UUID",
      positions: "JSONObject",
    },
    ["id", "positions"],
  ],
}

const mutate = (items) => {
  let init = []
  let mutations = []
  let variables = {}
  let i = 0

  for (let [index, [identifier, input]] of items.entries()) {
    const name = getName(identifier)
    let args = []

    const [types, out] = definitions[name]

    for (let [key, value] of toPairs(input)) {
      if (isNil(value)) {
        continue
      }

      const variable = `v${i++}`
      const type = types[key]

      variables[variable] = value
      init.push(`$${variable}:${type}!`)

      args.push(`${key}:$${variable}`)
    }

    mutations.push(`a${index}: ${name}(${args.join(",")}) ${returns(out)}`)
  }

  const mutation = `mutation(${init.join(",")}) {${mutations.join(" ")}}`
  return client.mutation(mutation, variables).toPromise()
}

const returns = (value) =>
  typeof value === "string"
    ? value
    : value instanceof Array
    ? `{${value.join(", ")}}`
    : ""

const structure = (changes) => {
  const deps = {
    createAction: {
      key: "moduleId",
      parent: "createModule",
    },
    createSomething: {
      key: "actionId",
      parent: "createAction",
    },
  }

  let result = []

  for (let [identifier, input] of toPairs(changes)) {
    const name = getName(identifier)
    const dependency = deps[name]
    const entry = [identifier, input]

    /**
     * No need to add the data if it already in the result
     */
    if (exists(identifier, result)) {
      continue
    }

    /**
     * When there is no dependencies
     */
    if (!dependency) {
      result.push(entry)

      continue
    }

    const parent = identify(dependency.parent, input[dependency.key])

    /**
     * When parent data already added to result
     */
    if (exists(parent, result)) {
      result = insert(parent, result, entry)

      continue
    }

    /**
     * When parent exists in source
     */
    if (changes[parent]) {
      result.push([parent, changes[parent], [entry]])

      continue
    }

    result.push(entry)
  }

  return result
}

const send = async ([head, ...tail]) => {
  if (!head) {
    return []
  }

  const children = head[2]

  const res = await Promise.all([mutate([head]), ...(await send(tail))])

  if (children) {
    await send(children)
  }

  return res
}

const exists = (identifier, [head, ...tail]) => {
  if (!head) {
    return false
  }

  if (head[0] === identifier) {
    return true
  }

  if (head[2]) {
    return exists(identifier, head[2])
  }

  return exists(identifier, tail)
}

const insert = (identifier, [head, ...tail], data) => {
  if (!head) {
    return []
  }

  const [id, input, children = []] = head

  if (id === identifier) {
    return [[id, input, [...children, data]], ...tail]
  }

  if (children.length) {
    return [
      [id, input, insert(identifier, children, data)],
      ...insert(identifier, tail, data),
    ]
  }

  return [head, ...insert(identifier, tail, data)]
}

const createChanges = (initialState, state) => {
  const diff = deepDiff(initialState.entities, state.entities) || []

  let result = {}

  for (let { kind, path, rhs, item } of diff) {
    /**
     * Create module
     */
    if (kind === "N" && path[0] === "modules" && path.length === 2) {
      const moduleId = rhs.id
      const identifier = identify("createModule", moduleId)

      result[identifier] = {
        ...result[identifier],
        moduleId,
        type: rhs.type,
        name: rhs.name,
        config: rhs.config,
      }

      for (let actionId of rhs.actions) {
        const identifier = identify("createAction", actionId)

        result[identifier] = {
          ...result[identifier],
          moduleId,
        }
      }
    }

    /**
     * Create module(assign position to layout)
     */
    if (
      kind === "N" &&
      path[0] === "layouts" &&
      path[2] === "positions" &&
      path.length === 4
    ) {
      const layoutId = path[1]
      const moduleId = path[3]
      const identifier = identify("createModule", moduleId)

      result[identifier] = {
        ...result[identifier],
        layoutId,
        position: rhs,
      }
    }

    /**
     * Update module information
     */
    if (
      (kind === "E" || kind === "N" || kind === "A") &&
      path[0] === "modules" &&
      ["name", "config"].includes(path[2]) &&
      path.length > 2
    ) {
      const moduleId = path[1]
      const field = path[2]
      const objectField = path[3]
      const isObject = field === "config" && path.length > 3
      const identifier = identify("updateModule", moduleId)

      result[identifier] = {
        ...result[identifier],
        moduleId,
        [field]: isObject
          ? {
              ...result[identifier]?.[field],
              [objectField]:
                state.entities.modules[moduleId][field][objectField],
            }
          : rhs,
      }
    }

    /**
     * Remove module
     */
    if (kind === "D" && path[0] === "modules" && path.length === 2) {
      const moduleId = path[1]
      const identifier = identify("removeModule", moduleId)

      result[identifier] = {
        moduleId,
      }
    }

    /**
     * Update layout position
     */
    if (
      kind === "E" &&
      path[0] === "layouts" &&
      path[2] === "positions" &&
      path.length === 5
    ) {
      const layoutId = path[1]
      const positionId = path[3]
      const field = path[4]
      const identifier = identify("updateLayout", layoutId)

      result[identifier] = {
        layoutId,
        positions: {
          ...result[identifier]?.positions,
          [positionId]: {
            ...result[identifier]?.positions[positionId],
            [field]: rhs,
          },
        },
      }
    }

    /**
     * Create action
     */
    if (kind === "N" && path[0] === "actions" && path.length === 2) {
      const actionId = path[1]
      const identifier = identify("createAction", actionId)

      result[identifier] = {
        ...result[identifier],
        actionId,
        order: rhs.order,
        field: rhs.field,
        type: rhs.type,
        name: rhs.name,
        config: rhs.config,
        relations: rhs.relations,
      }
    }

    /**
     * Creation action(assign to existing module)
     */
    if (
      kind === "A" &&
      path[0] === "modules" &&
      path[2] === "actions" &&
      path.length === 3 &&
      item.kind === "N"
    ) {
      const moduleId = path[1]
      const actionId = item.rhs
      const identifier = identify("createAction", actionId)

      result[identifier] = {
        ...result[identifier],
        moduleId,
      }
    }

    /**
     * Update action
     */
    if (
      (kind === "E" || kind === "N" || kind === "A") &&
      path[0] === "actions" &&
      ["name", "config", "relations"].includes(path[2]) &&
      path.length > 2
    ) {
      const actionId = path[1]
      const field = path[2]
      const objectField = path[3]
      const isObject =
        ["config", "relations"].includes(field) && path.length > 3
      const identifier = identify("updateAction", actionId)

      result[identifier] = {
        ...result[identifier],
        actionId,
        [field]: isObject
          ? {
              ...result[identifier]?.[field],
              [objectField]:
                state.entities.actions[actionId][field][objectField],
            }
          : rhs,
      }
    }

    /**
     * Remove action
     */
    if (kind === "D" && path[0] === "actions" && path.length === 2) {
      const actionId = path[1]
      const identifier = identify("removeAction", actionId)

      result[identifier] = {
        actionId,
      }
    }
  }

  return result
}

const identify = (name, id) => `${name}/${id}`

const getName = (identifier) => identifier.split("/")[0]
