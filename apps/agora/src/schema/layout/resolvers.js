import * as positionRepo from "repos/position"
import { transformPositions, createPositionType } from "./utils"

const updatePositions = (parent, { positions }, { pg }) =>
  positionRepo.batchUpdate(transformPositions(positions), pg)

const positions = async (parent, args, ctx) =>
  ctx.loaders.positionsByLayout.load(parent.id)

/**
 * Note
 *
 * For the future cases when Layout will have other content apart from Module,
 * use union type and return appropriate loader depending on parent position
 * type(introduce new column in positions table).
 */
const module = (parent, args, ctx) =>
  ctx.loaders.moduleByPosition.load(parent.id)

export default {
  Mutation: {
    updatePositions,
  },
  Layout: {
    positions,
  },
  Position: createPositionType({ module }),
}
