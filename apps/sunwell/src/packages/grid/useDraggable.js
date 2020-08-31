import { useDrag } from "react-dnd"
import * as itemTypes from "./itemTypes"

export default (id, layout, info, content, components) => {
  const [{ isDragging }, dragRef] = useDrag({
    item: {
      type: itemTypes.DRAGGABLE_INNER,
      id,
      content,
      components,
      unit: layout[id],
      info,
    },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      const didDrop = monitor.didDrop()

      /**
       * Resetting source grid to the initial state when item was dropped
       * out of the grid.
       */
      if (item.reset && !didDrop) {
        item.reset()
      }
    },
  })

  // useEffect(() => {
  //   preview(getEmptyImage())
  // }, [])

  return [dragRef, isDragging]
}
