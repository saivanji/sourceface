import { parse } from "graphql"
import * as utils from "../utils"

export default (result, { moduleId, layoutId, position }, cache) => {
  const pageId = utils.findPageIdByLayout(layoutId, cache)
  const page = cache.readFragment(pageFragment, { id: pageId })
  const layout = cache.readFragment(layoutFragment, { id: layoutId })

  const module = {
    ...result.createModule,
    actions: [],
    // TODO: consider case when module created with child layouts
    layouts: [],
  }

  cache.writeFragment(pageFragment, {
    ...page,
    modules: [...page.modules, module],
  })

  cache.writeFragment(layoutFragment, {
    ...layout,
    positions: {
      ...layout.positions,
      [moduleId]: position,
    },
  })
}

const pageFragment = parse(`
  fragment _ on Page {
    id
    modules {
      id
      actions {
        id
      }
      layouts {
        id
      }
    }
  }
`)

const layoutFragment = parse(`
  fragment _ on Layout {
    id
    positions
  }
`)
