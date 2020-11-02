export default ({ layoutId, positions }) => {
  return {
    __typename: "Layout",
    id: layoutId,
    positions,
  }
}
