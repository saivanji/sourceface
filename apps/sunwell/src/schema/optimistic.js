export const removeModule = ({ moduleId }, cache) => {
  // cache.invalidate({ __typename: "Position", id: module.position.id })

  // TODO: will implementing schema awareness feature will force removing the
  // position assigned with that module without fetching page query?
  // (that will allow to remove module immediately without waiting until page is fetched)
  // Check that by retrieving module position in some time after module invalidation.

  // TODO: sometimes when deleting nested layout(probably not only nested) - an error
  // is raised(can not read "positions" of undefined in "layout.positions" in "Modules" component)
  // TODO: Check if all nested child stack was removed when parent module was invalidated
  cache.invalidate({ __typename: "Module", id: moduleId })
}

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
