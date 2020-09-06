import * as positionRepo from "repos/position"
import { transformPositions, createPositionType } from "./utils"

const updatePositions = (parent, { positions }, { pg }) =>
  /**
   * Handling empty update case in order to correspond to Graphql schema.
   */
  positions.length
    ? positionRepo.batchUpdate(transformPositions(positions), pg)
    : []

const positions = async (parent, args, ctx) =>
  ctx.loaders.positionsByLayout.load(parent.id)

export default {
  Mutation: {
    updatePositions,
  },
  Layout: {
    positions,
  },
  Position: createPositionType(),
}
