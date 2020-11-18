import * as layoutRepo from "repos/layout"

// TODO: use deep merge with existing positions
const updateLayout = (parent, { layoutId, positions }, { pg }) =>
  layoutRepo.updatePositions(layoutId, positions, pg)

export default {
  Mutation: {
    updateLayout,
  },
}
