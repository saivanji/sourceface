import { parse } from "graphql"
import { chain, difference, prop, propEq, keys } from "ramda"
import * as utils from "../utils"

/**
 * There are multiple different cases when positions are updated:
 * 1. When item is moved to another place within the same layout or item is resized.
 * In that case no manual cache update needed. That will be handled automatically.
 * 2. When item is moved from one layout to another. In that case we need to remove
 * position from the source layout and put it into the target.
 * 3. When item is created. In that case no update needed here but after module is
 * created it's position needs to be put on the layout.
 *
 * One important note, is when positions are updated, only changed positions are
 * provided instead of all positions of the layout so that needs to be considered
 * while updating the cache.
 */
export default (result, args, cache) => {
  /**
   * Since that mutation allows to update positions for many layouts, we're groupping
   * positions by layoutId.
   */
  const positionsByLayout = tranfsormPositions(
    args.positions,
    result.updatePositions
  )
  const layoutIds = keys(positionsByLayout)

  for (let id of layoutIds) {
    const layoutId = +id
    const updatedPositionIds = positionsByLayout[layoutId].map(prop("id"))
    const positionIds = getLayoutPositionIds(layoutId, cache)
    const diff = difference(updatedPositionIds, positionIds)

    /**
     * Do nothing when positions were changed within the same layout. Cases #1 and #3.
     */
    if (!diff.length) {
      return
    }

    /**
     * Since layouts are not spread across multiple pages, we can safely assume that
     * layout belongs to only one page.
     */
    const pageId = utils.findPageIdByLayout(layoutId, cache)

    /**
     * Since one position can belong only to one layout, making sure that
     * it doesn't exist somewhere else(in case when we move item from one
     * layout to another).
     */
    cleanupPageLayout(diff, pageId, cache)
    cleanupModulesLayouts(diff, pageId, cache)

    const updatedPositions = positionsByLayout[layoutId].filter((p) =>
      diff.includes(p.id)
    )

    const { positions } = cache.readFragment(layoutFragment, {
      id: layoutId,
    })
    cache.writeFragment(layoutFragment, {
      id: layoutId,
      positions: [...positions, ...updatedPositions],
    })
  }
}

/**
 * Removes position ids in "diff" from a root layout on a given page.
 */
const cleanupPageLayout = (diff, pageId, cache) => {
  const layoutId = cache.resolve(
    cache.resolve({ __typename: "Page", id: pageId }, "layout"),
    "id"
  )

  for (let positionId of diff) {
    removePositionIfExists(layoutId, positionId, cache)
  }
}

/**
 * Removes position ids in "diff" from a modules layouts on a given page.
 */
const cleanupModulesLayouts = (diff, pageId, cache) => {
  const moduleLinks = cache.resolve(
    { __typename: "Page", id: pageId },
    "modules"
  )
  const layoutIdsOfModules = chain(
    (link) =>
      cache.resolve(link, "layouts").map((link) => cache.resolve(link, "id")),
    moduleLinks
  )

  for (let layoutId of layoutIdsOfModules) {
    for (let positionId of diff) {
      removePositionIfExists(layoutId, positionId, cache)
    }
  }
}

const removePositionIfExists = (layoutId, positionId, cache) => {
  const { positions } = cache.readFragment(layoutFragment, { id: layoutId })
  const hasPosition = !!positions.find((p) => p.id === positionId)

  /**
   * No need to remove if layout has no desired position.
   */
  if (!hasPosition) {
    return
  }

  cache.writeFragment(layoutFragment, {
    id: layoutId,
    positions: positions.filter((p) => p.id !== positionId),
  })
}

const getLayoutPositionIds = (layoutId, cache) =>
  cache
    .resolve({ __typename: "Layout", id: layoutId }, "positions")
    .map((link) => cache.resolve(link, "id"))

const tranfsormPositions = (positionsIn, positionsOut) =>
  positionsIn.reduce(
    (acc, { id, layoutId }) => ({
      ...acc,
      [layoutId]: [
        ...(acc[layoutId] || []),
        positionsOut.find(propEq("id", id)),
      ],
    }),
    {}
  )

const layoutFragment = parse(`
  fragment _ on Layout {
    id
    positions {
      id
    }
  }
`)
