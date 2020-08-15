export const updatePositions = `
  mutation($positions: [PositionInput!]!) {
    updatePositions(positions: $positions) {
      id
      x
      y
      w
      h
    }
  }
`

export const createModule = `
  mutation(
    $type: ModuleType!
    $config: JSONObject!
    $position: PositionInput!
    $positions: [PositionInput!]!
  ) {
    updatePositions(positions: $positions) {
      id
      x
      y
      w
      h
    }
    createModule(type: $type, config: $config, position: $position) {
      id
      type
      config
      position {
        id
        x
        y
        w
        h
      }
      layouts {
        id
        positions {
          id
          x
          y
          w
          h
        }
      }
    }
  }
`

export const updateModule = `
  mutation($moduleId: Int!, $key: String!, $value: JSON!) {
    updateModule(moduleId: $moduleId, key: $key, value: $value) {
      id
      config
    }
  }
`

export const removeModule = `
  mutation($moduleId: Int!) {
    removeModule(moduleId: $moduleId)
  }
`
