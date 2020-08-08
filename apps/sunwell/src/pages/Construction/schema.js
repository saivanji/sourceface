export const root = `
  query ($pageId: Int!) {
    page(pageId: $pageId) {
      id
      title
      layout {
        id
        positions {
          id
          x
          y
          w
          h
        } 
      }
      modules {
        id
        positionId
        type
        config
      }
    }
    commands {
      id
    }
  }
`

export const createModule = `
  mutation ($type: ModuleType!, $config: JSONObject!, $position: ModulePositionInput!) {
    createModule(type: $type, config: $config, position: $position) {
      id
      type
      config
      position {
        x
        y
        w
        h
      }
    }
  }
`

export const updateModule = `
  mutation ($moduleId: Int!, $key: String!, $value: JSON!) {
    updateModule(moduleId: $moduleId, key: $key, value: $value) {
      id
      config
    }
  }
`

export const updateModulesPositions = `
  mutation ($positions: [SpecificModulePositionInput!]!) {
    updateModulesPositions(positions: $positions) {
      id
      position {
        x
        y
        w
        h
      }
    }
  }
`
