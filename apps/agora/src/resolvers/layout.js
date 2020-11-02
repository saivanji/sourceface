import * as layoutRepo from "repos/layout"

const updateLayout = (parent, { layoutId, positions }, { pg }) =>
  layoutRepo.updatePositions(layoutId, positions, pg)

export default {
  Mutation: {
    updateLayout,
  },
}
