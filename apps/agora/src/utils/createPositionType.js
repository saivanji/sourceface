export default () =>
  ["x", "y", "w", "h"].reduce(
    (acc, key) => ({
      ...acc,
      [key]: parent => parent.position[key],
    }),
    {}
  )
