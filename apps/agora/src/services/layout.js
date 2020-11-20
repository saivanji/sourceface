import { mergeDeepRight } from "ramda"
import * as layoutRepo from "repos/layout"

export const updatePositions = (layoutId, positions, pg) =>
  pg.task(async (t) => {
    const layout = await layoutRepo.one(layoutId, t)

    return await layoutRepo.updatePositions(
      layoutId,
      mergeDeepRight(layout.positions, positions),
      t
    )
  })
