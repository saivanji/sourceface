export default ({ actionId, name }) => {
  const __typename = "Action"

  return {
    __typename,
    id: actionId,
    name,
  }
}
