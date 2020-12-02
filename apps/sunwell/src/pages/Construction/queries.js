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
      layout {
        id
        positions
      }
      modules {
        id
        name
        type
        config
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
        layouts {
          id
          positions
        }
      }
    }
  }
`
