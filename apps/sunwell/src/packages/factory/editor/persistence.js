import { useState, useEffect } from "react"
import { keys, toPairs } from "ramda"
import { client } from "packages/client"
import deepDiff from "deep-diff"

export const useSave = (initialState, state) => {
  const [isPristine, setPristine] = useState(true)
  const [isSaving, setSaving] = useState(false)
  const save = async () => {
    const mutation = createMutation(createChanges(initialState, state))

    console.log(mutation)

    setSaving(true)
    await client.mutation(mutation).toPromise()
    setSaving(false)

    // TODO: reset editor state
  }

  useEffect(() => {
    const changes = createChanges(initialState, state)
    const isEqual = keys(changes).length === 0

    if (isEqual !== isPristine) {
      setPristine(isEqual)
    }
  })

  return [isPristine, isSaving, save]
}

// all fields will be required in generated mutation
const definition = {
  createModule: [
    {
      moduleId: "UUID",
      layoutId: "UUID",
      type: "ModuleType",
      name: "String",
      config: "JSONObject",
      positions: "JSONObject",
    },
    ["id", "type", "config"],
  ],
  updateModule: [
    {
      moduleId: "UUID",
      name: "String",
      config: "JSONObject",
    },
    "@populate",
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
      type: "ModuleType",
      name: "String",
      config: "JSONObject",
      relations: "JSONObject",
    },
    "@populate",
  ],
  updateAction: [
    {
      actionId: "UUID",
      name: "String",
      config: "JSONObject",
      relations: "JSONObject",
    },
    "@populate",
  ],
  removeAction: [
    {
      actionId: "UUID",
    },
  ],
}

const createMutation = (changes) => {
  const body = toPairs(changes).reduce((result, [identifier, args], i) => {
    const mutationName = identifier.split("/")[0]
    // const variableName = `$v${i}`

    return result + `${mutationName}(${stringifyArgs(args)}) @populate`
  }, "")

  return `mutation {${body}}`
}

const stringifyArgs = (args) =>
  toPairs(args)
    .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
    .join(",")

const createChanges = (initialState, state) => {
  const diff = deepDiff(initialState.entities, state.entities) || []

  let result = {}

  for (let { kind, path, rhs, item } of diff) {
    /**
     * Create module
     */
    if (kind === "N" && path[0] === "modules" && path.length === 2) {
      const moduleId = rhs.id
      const identifier = `createModule/${moduleId}`

      result[identifier] = {
        ...result[identifier],
        moduleId,
        type: rhs.type,
        name: rhs.name,
        config: rhs.config,
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
      const identifier = `createModule/${moduleId}`

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
      const identifier = `updateModule/${moduleId}`

      result[identifier] = {
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
      const identifier = `removeModule/${moduleId}`

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
      const identifier = `updateLayout/${layoutId}`

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
      const identifier = `createAction/${actionId}`

      result[identifier] = {
        ...result[identifier],
        actionId,
        type: rhs.type,
        name: rhs.name,
        config: rhs.config,
        relations: rhs.relations,
      }
    }

    /**
     * Creation action(assign to module)
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
      const identifier = `createAction/${actionId}`

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
      const identifier = `updateAction/${actionId}`

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
      const identifier = `removeAction/${actionId}`

      result[identifier] = {
        actionId,
      }
    }
  }

  return result
}
