import gql from "graphql-tag"
import { propEq, keys } from "ramda"

// TODO: handle case of removing position from the list
// most likely when item moved from one grid to another, we need to remove position from the source layout and add it to the target layout. Think also of a case when we batch update multiple independent layouts with their positions in one mutation.
// Also investigate why in the current situtation when we move item grid updates without crashes. Check in urql devtools
export default (result, args, cache) => {
  const positions = tranfsormPositions(args.positions, result.updatePositions)
  const layoutIds = keys(positions)
  // TODO: item disappears when moving "Hello 1" from parent to child and backwards

  console.log(positions)

  for (let layoutId of layoutIds) {
    cache.writeFragment(layoutFragment, {
      id: +layoutId,
      // TODO: when we'll be updating only changed positions, get initial layout positions and merge them with updated data
      positions: positions[layoutId],
    })
  }
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
