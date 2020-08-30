import { useState } from "react"

/**
 * When item position is changed, it's always put on the initial layout to avoid messing up
 * the layout while item is dragged.
 *
 * To achieve that, we have intermediate layout which we update during drag operation for displaying
 * the recent state to the user.
 *
 */
export default initialLayout => {
  const [layout, update] = useState(null)

  const reset = () => update(null)

  return [layout || initialLayout, update, reset]
}
