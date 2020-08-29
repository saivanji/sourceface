import { useDrag } from "react-dnd"
import * as itemTypes from "./itemTypes"

export default () => {
  const [{ isDragging }, dragRef] = useDrag({
    item: { type: itemTypes.INNER },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  })

  // useEffect(() => {
  //   preview(getEmptyImage())
  // }, [])

  return [dragRef, isDragging]
}
