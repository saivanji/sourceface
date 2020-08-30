import { useDrag } from "react-dnd"
import * as itemTypes from "./itemTypes"

export default (id, content, bounds, components) => {
  const [{ isDragging }, dragRef] = useDrag({
    item: { type: itemTypes.INNER, id, content, bounds, components },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  })

  // useEffect(() => {
  //   preview(getEmptyImage())
  // }, [])

  return [dragRef, isDragging]
}
