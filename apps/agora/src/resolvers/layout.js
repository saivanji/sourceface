import * as layoutService from "services/layout"

const updateLayout = (parent, { layoutId, positions }, { pg }) =>
  layoutService.updatePositions(layoutId, positions, pg)

export default {
  Mutation: {
    updateLayout,
  },
}
