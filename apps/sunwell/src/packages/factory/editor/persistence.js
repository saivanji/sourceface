import deepDiff from "deep-diff"

export default (initialState, state) => {
  const diff = deepDiff(initialState.entities, state.entities)

  console.log(diff)

  let result = {}

  for (let { kind, path, rhs } of diff) {
    /**
     * Module creation of base fields
     */
    if (kind === "N" && path[0] === "modules" && path.length === 2) {
      const moduleId = rhs.id
      const key = `createModule/${moduleId}`

      result[key] = {
        ...result[key],
        moduleId,
        type: rhs.type,
        name: rhs.name,
        config: rhs.config,
      }
    }

    /**
     * Module creation of position field
     */
    if (
      kind === "N" &&
      path[0] === "layouts" &&
      path[2] === "positions" &&
      path.length === 4
    ) {
      const layoutId = path[1]
      const moduleId = path[3]
      const key = `createModule/${moduleId}`

      result[key] = {
        ...result[key],
        layoutId,
        position: rhs,
      }
    }

    /**
     * Update module information
     */
    if (kind === "E" && path[0] === "modules") {
      const moduleId = path[1]
      const prop = path[2]
      const key = `updateModule/${moduleId}`

      result[key] =
        prop === "config"
          ? {
              ...result[key],
              moduleId,
              config: {
                ...result[key]?.config,
                [path[3]]: rhs,
              },
            }
          : {
              ...result[key],
              moduleId,
              [prop]: rhs,
            }
    }

    /**
     * Remove module
     */
    if (kind === "D" && path[0] === "modules" && path.length === 2) {
      const moduleId = path[1]
      const key = `removeModule/${moduleId}`

      result[key] = {
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
      const prop = path[4]
      const key = `updateLayout/${layoutId}`

      result[key] = {
        layoutId,
        positions: {
          ...result[key]?.positions,
          [positionId]: {
            ...result[key]?.positions[positionId],
            [prop]: rhs,
          },
        },
      }
    }
  }

  console.log(result)
}
