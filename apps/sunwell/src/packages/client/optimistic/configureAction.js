export default ({ actionId, key, value }, cache) => {
  const __typename = "Action"

  return {
    __typename,
    id: actionId,
    config: {
      ...cache.resolve({ __typename, id: actionId }, "config"),
      [key]: value,
    },
  }
}
