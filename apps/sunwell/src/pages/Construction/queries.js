export const constructionPage = `
  query($pageId: Int!) {
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
        type
        config
        positionId
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
    commands {
      id
    }
  }
`