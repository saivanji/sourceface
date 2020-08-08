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

export const updateLayout = `
  mutation ($layoutId: Int!, $positions: [PositionInputWithId!]!) {
    updateLayout(layoutId: $layoutId, positions: $positions) {
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
