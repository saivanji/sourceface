import gql from "graphql-tag"
import * as utils from "../utils"

export default (result, { moduleId }, cache) => {
  /**
   * Since modules are unique across multiple pages, we can get pageId by the moduleId
   */
  const pageId = utils.findPageIdByModule(moduleId, cache)
  const page = cache.readFragment(pageFragment, { id: pageId })
  const { positionId } = page.modules.find(module => module.id === moduleId)

  /**
   * Removing position from the root layout in case top-level module
   * was deleted.
   */
  const positions = filterPositions(positionId, page.layout.positions)
  /**
   * Removing deleted module from the list. Also removing assigned position
   * from the layout in case module was located in nested layout.
   */
  const modules = filterModules(moduleId, positionId, page.modules)

  cache.writeFragment(pageFragment, {
    ...page,
    layout: {
      ...page.layout,
      positions,
    },
    modules,
  })
}

const filterModules = (moduleId, positionId, modules) =>
  modules.reduce(
    (acc, module) =>
      module.id === moduleId
        ? acc
        : [
            ...acc,
            {
              ...module,
              layouts: module.layouts.map(layout => ({
                ...layout,
                positions: filterPositions(positionId, layout.positions),
              })),
            },
          ],
    []
  )

const filterPositions = (positionId, positions) =>
  positions.filter(position => position.id !== positionId)

const pageFragment = gql`
  fragment pageFragment on Page {
    id
    layout {
      id
      positions {
        id
      }
    }
    modules {
      id
      positionId
      layouts {
        id
        positions {
          id
        }
      }
    }
  }
`
