import * as layoutRepo from "repos/layout"
import * as positionRepo from "repos/position"

const positions = async ({ id }, args, ctx) => {
  return ctx.loaders.positionsByLayout.load(id)
}

const updateLayout = async (parent, { layoutId, positions }, ctx) => {
  const positionsIn = positions.map(({ id, ...position }) => ({
    id,
    position,
    layout_id: layoutId,
  }))

  return await ctx.pg.tx(async t => {
    const layout = await layoutRepo.one(layoutId, t)
    await positionRepo.deleteByLayoutId(layoutId, t)
    const positionsOut = await positionRepo.batchInsert(positionsIn, t)

    return {
      ...layout,
      positions: positionsOut,
    }
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
    updateLayout,
  },
  Layout: {
    positions,
  },
  Position,
}
