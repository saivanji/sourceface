import { useState, useEffect } from "react"
import { keys } from "ramda"
import deepDiff from "deep-diff"

export const useSave = (initialState, state) => {
  const [isPristine, setPristine] = useState(true)
  const save = () => createMutations(initialState, state)

  useEffect(() => {
    const mutations = save()
    const isEqual = keys(mutations).length === 0

    if (isEqual !== isPristine) {
      setPristine(isEqual)
    }
  })

  return [isPristine, save]
}

const createMutations = (initialState, state) => {
  const diff = deepDiff(initialState.entities, state.entities) || []

  let result = {}

  for (let { kind, path, rhs, item } of diff) {
    /**
     * Create module
     */
    if (kind === "N" && path[0] === "modules" && path.length === 2) {
      const moduleId = rhs.id
      const mutation = `createModule/${moduleId}`

      result[mutation] = {
        ...result[mutation],
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
      const mutation = `createModule/${moduleId}`

      result[mutation] = {
        ...result[mutation],
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
      const mutation = `updateModule/${moduleId}`

      result[mutation] = {
        moduleId,
        [field]: isObject
          ? {
              ...result[mutation]?.[field],
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
      const mutation = `removeModule/${moduleId}`

      result[mutation] = {
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
      const mutation = `updateLayout/${layoutId}`

      result[mutation] = {
        layoutId,
        positions: {
          ...result[mutation]?.positions,
          [positionId]: {
            ...result[mutation]?.positions[positionId],
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
      const mutation = `createAction/${actionId}`

      result[mutation] = {
        ...result[mutation],
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
      const mutation = `createAction/${actionId}`

      result[mutation] = {
        ...result[mutation],
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
      const mutation = `updateAction/${actionId}`

      result[mutation] = {
        ...result[mutation],
        actionId,
        [field]: isObject
          ? {
              ...result[mutation]?.[field],
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
      const mutation = `removeAction/${actionId}`

      result[mutation] = {
        actionId,
      }
    }
  }

  return result
}
