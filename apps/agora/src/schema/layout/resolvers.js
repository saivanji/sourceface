import * as positionRepo from "repos/position"
import { transformPositions } from "./utils"

const positions = async ({ id }, args, ctx) => {
  return ctx.loaders.positionsByLayout.load(id)
}

const updatePositions = (parent, { positions }, { pg }) =>
  positionRepo.batchUpdate(transformPositions(positions), pg)

const Position = ["x", "y", "w", "h"].reduce(
  (acc, key) => ({
    ...acc,
    [key]: parent => parent.position[key],
  }),
  {}
)

export default {
  Mutation: {
    updatePositions,
  },
  Layout: {
    positions,
  },
  Position,
}
