import * as layoutRepo from "repos/layout"

const updateLayout = (parent, { layoutId, positions }, { pg }) =>
  layoutRepo.insertPositions(layoutId, positions, pg)

export default {
  Mutation: {
    updateLayout,
  },
}
