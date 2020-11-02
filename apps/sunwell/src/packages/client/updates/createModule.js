import { parse } from "graphql"
import * as utils from "../utils"

export default (result, { layoutId }, cache) => {
  const pageId = utils.findPageIdByLayout(layoutId, cache)
  const page = cache.readFragment(pageFragment, { id: pageId })

  cache.writeFragment(pageFragment, {
    ...page,
    modules: [...page.modules, result.createModule],
  })
}

// TODO: why it's not causing extra page request
const pageFragment = parse(`
  fragment _ on Page {
    id
    modules {
      id
    }
  }
`)
