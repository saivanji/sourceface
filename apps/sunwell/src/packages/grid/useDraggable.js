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
  })

  // useEffect(() => {
  //   preview(getEmptyImage())
  // }, [])

  return [dragRef, isDragging]
}
