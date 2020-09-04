import gql from "graphql-tag"
import { propEq, keys } from "ramda"

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
  // const positionsByLayout = tranfsormPositions(
  //   args.positions,
  //   result.updatePositions
  // )
  // const layoutIds = keys(positionsByLayout)
  // // TODO: item disappears when moving "Hello 1" from parent to child and backwards
  // for (let layoutId of layoutIds) {
  //   /**TODO:
  //    * Since one position can belong only to one layout, making sure that
  //    * it doesn't exist somewhere else(in case when we move item from one
  //    * layout to another).
  //    */
  //   const positions = cache.readFragment(layoutFragment, {
  //     id: +layoutId,
  //   })
  //   console.log(positions, positionsByLayout[layoutId])
  //   cache.writeFragment(layoutFragment, {
  //     id: +layoutId,
  //     // TODO: when we'll be updating only changed positions, get initial layout positions and merge them with updated data
  //     positions: positionsByLayout[layoutId],
  //   })
  // }
}

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

const layoutFragment = gql`
  fragment layoutFragment on Layout {
    id
    positions {
      id
    }
  }
`
