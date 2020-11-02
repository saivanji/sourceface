import { parse } from "graphql"
import * as utils from "../utils"

export default (result, { moduleId }, cache) => {
  /**
   * Since modules are unique across multiple pages, we can get pageId by the moduleId
   */
  const pageId = utils.findPageIdByModule(moduleId, cache)
  const page = cache.readFragment(pageFragment, { id: pageId })

  const modules = page.modules.filter((m) => m.id !== moduleId)

  cache.writeFragment(pageFragment, {
    ...page,
    modules,
  })
}

const pageFragment = parse(`
  fragment _ on Page {
    id
    modules {
      id
    }
  }
`)
