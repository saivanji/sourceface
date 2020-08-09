export const transformPositions = positions =>
  positions.map(({ id, layoutId, ...position }) => ({
    id,
    layoutId,
    position,
  }))
