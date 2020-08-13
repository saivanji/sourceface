export const updateModule = ({ moduleId, key, value }, cache) => {
  const __typename = "Module"

  return {
    __typename,
    id: moduleId,
    config: {
      ...cache.resolve({ __typename, id: moduleId }, "config"),
      [key]: value,
    },
  }
}

export const updatePositions = ({ positions }) => {
  return positions.map(position => ({
    __typename: "Position",
    ...position,
  }))
}
