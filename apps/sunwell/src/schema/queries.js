// TODO: what if we request x, y, w, h from modules position instead of layout?
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
        position {
          id
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
    commands {
      id
    }
  }
`
