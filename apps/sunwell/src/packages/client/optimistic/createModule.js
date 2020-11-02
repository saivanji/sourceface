export default ({ moduleId, type, name, config }) => {
  const __typename = "Module"

  return {
    __typename,
    id: moduleId,
    type,
    name,
    config,
    actions: [],
    layouts: [],
  }
}
