import gql from "graphql-tag"

export default (result, { position }, cache) => {
  // TODO: use pageId from the url
  /**
   * Getting page id from the url since it's not passed as argument when
   * creating a module.
   *
   * That's an exclusive case. Since modules have infinite nesting
   * level and graphql doesn't offer recursive queries, we need to request all
   * modules for the specific page in a flat form. Therefore page id is needed
   * for appending created module to the all modules list that page has.
   *
   */
  const pageId = 1
  const page = cache.readFragment(pageFragment, { id: pageId })
  const layout = cache.readFragment(layoutFragment, { id: position.layoutId })

  cache.writeFragment(pageFragment, {
    ...page,
    modules: [...page.modules, result.createModule],
  })
  cache.writeFragment(layoutFragment, {
    ...layout,
    positions: [...layout.positions, result.createModule.position],
  })
}

const layoutFragment = gql`
  fragment layoutFragment on Layout {
    id
    positions {
      id
    }
  }
`

const pageFragment = gql`
  fragment pageFragment on Page {
    id
    modules {
      id
    }
  }
`
