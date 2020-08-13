export const transformPositions = positions =>
  positions.map(({ id, layoutId, ...position }) => ({
    id,
    layoutId,
    position,
  }))

export const createPositionType = () =>
  ["x", "y", "w", "h"].reduce(
    (acc, key) => ({
      ...acc,
      [key]: parent => parent.position[key],
    }),
    {}
  )
