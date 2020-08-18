export const updatePositions = `
  mutation($positions: [PositionInput!]!) {
    updatePositions(positions: $positions) @populate
  }
`

export const createModule = `
  mutation(
    $type: ModuleType!
    $config: JSONObject!
    $position: PositionInput!
    $positions: [PositionInput!]!
  ) {
    updatePositions(positions: $positions) @populate
    createModule(type: $type, config: $config, position: $position) @populate
  }
`

export const updateModule = `
  mutation($moduleId: Int!, $key: String!, $value: JSON!) {
    updateModule(moduleId: $moduleId, key: $key, value: $value) @populate
  }
`

export const removeModule = `
  mutation($moduleId: Int!) {
    removeModule(moduleId: $moduleId)
  }
`
