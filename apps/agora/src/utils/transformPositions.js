export default positions =>
  positions.map(({ id, layoutId, ...position }) => ({
    id,
    layoutId,
    position,
  }))
