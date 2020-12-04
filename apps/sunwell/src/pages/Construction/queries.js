export const root = `
  query($path: String!) {
    page(path: $path) {
      id
      title
      route
      trail {
        id
        route
        title
      }
      modules {
        id
        parentId
        name
        type
        config
        position
        actions {
          id
          order
          field
          type
          name
          config
          relations
          pages {
            id
            title
            route
          }
          commands {
            id
            name
            stale {
              id
            }
          }
        }
      }
    }
  }
`
