import { useDrop } from "react-dnd"
import * as itemTypes from "./itemTypes"

export default () => {
  const [{ item, isOver }, dropRef] = useDrop({
    accept: itemTypes.INNER,
    collect: monitor => ({
      item: monitor.getItem(),
      isOver: monitor.isOver({ shallow: true }),
    }),
  })

  return [dropRef, isOver, item]
}
