import gql from "graphql-tag"
import { propEq, keys } from "ramda"

export default (result, args, cache) => {
  const positions = tranfsormPositions(args.positions, result.updatePositions)
  const layoutIds = keys(positions)

  /**
   * Layout of positions was not changed so no further update needed
   */
  if (layoutIds.length === 1) return

  for (let layoutId of layoutIds) {
    cache.writeFragment(layoutFragment, {
      id: layoutId,
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
      x
      y
      w
      h
    }
  }
`
