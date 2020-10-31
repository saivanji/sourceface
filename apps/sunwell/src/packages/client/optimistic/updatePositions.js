export default ({ positions }) => {
  return positions.map(position => ({
    __typename: "Position",
    ...position,
  }))
}
