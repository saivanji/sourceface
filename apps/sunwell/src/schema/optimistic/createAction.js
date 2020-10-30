// TODO: doesn't work
export default ({ actionId, type, config }) => {
  const __typename = "Action"

  return {
    __typename,
    id: actionId,
    type,
    config,
    name: null,
  }
}
