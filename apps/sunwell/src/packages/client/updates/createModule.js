import { parse } from "graphql"

export default (result, { pageId }, cache) => {
  const page = cache.readFragment(pageFragment, { id: pageId })

  const module = {
    ...result.createModule,
    actions: [],
  }

  cache.writeFragment(pageFragment, {
    ...page,
    modules: [...page.modules, module],
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
    }
  }
`)
