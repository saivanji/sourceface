export default ({ moduleId, type, config, position }) => {
  const __typename = "Module"

  return {
    __typename,
    id: moduleId,
    createdAt: "",
    type,
    config,
    // position: omit(["layoutId"], position),
    name: "",
    actions: [],
    layouts: [],
  }
}
