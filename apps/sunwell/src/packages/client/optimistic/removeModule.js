/**
 * Since that function is defined, "removeModule" update will be called at the point
 * of optimistic update as well, so we can simply return the actual response
 * of a mutation.
 */
export default () => {
  return true
}
