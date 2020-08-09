import * as layoutRepo from "repos/layout"
import * as positionRepo from "repos/position"
import * as utils from "./utils"

const positions = async ({ id }, args, ctx) => {
  return ctx.loaders.positionsByLayout.load(id)
}

const updateLayouts = async (parent, { layouts: layoutsIn }, ctx) => {
  const positionsIn = utils.createPositions(layoutsIn)

  return await ctx.pg.tx(async t => {
    const layouts = await Promise.all(
      layoutsIn.map(({ layoutId }) => layoutRepo.one(layoutId, t))
    )
    const positions = await positionRepo.batchUpdate(positionsIn, t)

    return utils.populateLayouts(layouts, positions)
  })
}

const Position = ["x", "y", "w", "h"].reduce(
  (acc, key) => ({
    ...acc,
    [key]: parent => parent.position[key],
  }),
  {}
)

export default {
  Mutation: {
    updateLayouts,
  },
  Layout: {
    positions,
  },
  Position,
}
