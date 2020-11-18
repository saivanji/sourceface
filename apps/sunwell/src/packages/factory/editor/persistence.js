import deepDiff from "deep-diff"

export default (initialState, state) => {
  const diff = deepDiff(initialState.entities, state.entities)

  console.log(diff)

  let result = {}

  for (let { kind, path, rhs } of diff) {
    /**
     * Module creation
     */
    if (kind === "N" && path[0] === "modules" && path.length === 2) {
      const moduleId = rhs.id

      result[`createModule/${moduleId}`] = {
        moduleId,
        layoutId: null,
        type: rhs.type,
        name: rhs.name,
        config: rhs.config,
      }
    }

    /**
     * Add layout position
     */
    if (
      kind === "N" &&
      path[0] === "layouts" &&
      path[2] === "positions" &&
      path.length === 4
    ) {
      const layoutId = path[1]
      const positionId = path[3]
      const key = `updateLayout/${layoutId}`

      result[key] = {
        layoutId,
        positions: {
          ...result[key]?.positions,
          [positionId]: rhs,
        },
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
