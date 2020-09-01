import { useDrag, useDrop } from "react-dnd"
import * as itemTypes from "./itemTypes"

export const useResize = function Resizable(content, components) {
  const [{ isResizing }, connectSe] = useDrag({
    item: {
      type: itemTypes.RESIZABLE,
      content,
      components,
    },
    collect: monitor => ({
      isResizing: monitor.isDragging(),
    }),
  })

  return [connectSe, isResizing]
}

// TODO: create symbol in a grid instance and pass as type in order not to conflicts with sibling surfaces?
export const useResizeArea = function ResizableArea() {
  const [{ isOver }, connect] = useDrop({
    accept: itemTypes.RESIZABLE,
    collect: monitor => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
  })

  console.log(isOver)

  return [connect, isOver]
}
