export default ({ actionId, type, config }) => {
  return {
    __typename: "Action",
    id: actionId,
    type,
    config,
    name: null,
  }
}
