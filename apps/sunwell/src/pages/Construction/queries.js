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
          references {
            pages {
              field
              page {
                id
                title
                route
              }
            }
            operations {
              field
              operation {
                id
                name
                stale {
                  id
                }
              }
            }
            modules {
              field
              module {
                id
                name
                type
                config
              }
            }
          }
        }
      }
    }
  }
`
