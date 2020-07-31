import React, {
  useRef,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react"
import { context } from "./Provider"
import { useDrag, useDrop, DndProvider } from "../dnd"
import { useApply } from "./hooks"
import * as utils from "./utils"
import { Item, Noop } from "./components"
import Lines from "./Lines"

// TODO: render droppable focus for the "box" type

export default props => {
  const isWrapped = useContext(context)
  const grid = <Grid {...props} />

  return !isWrapped ? <DndProvider>{grid}</DndProvider> : grid
}

function Grid({
  className,
  cols = 10,
  rows = 10,
  rowHeight = 20,
  isStatic,
  layout: initialLayout,
  // TODO: should it be a component?
  renderItem,
  onChange,
  components = {},
}) {
  const { DragPlaceholder = Noop } = components

  const [dragPlaceholder, setDragPlaceholder] = useState(null)
  const [container, setContainer] = useState(null)
  const info = useApply(utils.toInfo, [cols, rows, container?.width, rowHeight])
  const layout = initialLayout
  const ids = useApply(Object.keys, [layout])

  const containerRef = useDroppable(container, info, {
    onStep: setDragPlaceholder,
  })

  useEffect(() => {
    setContainer(getOffset(containerRef.current))
  }, [])

  console.log(dragPlaceholder)

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", height: info.containerHeight }}
      className={className}
    >
      {container && <Lines info={info} />}
      {ids.map(id => {
        const element = renderItem(layout[id].data)

        if (!container?.width || isStatic) {
          return (
            <Item
              key={id}
              style={utils.toPercentageCSS(layout[id], info)}
              components={components}
            >
              {element}
            </Item>
          )
        }

        return (
          <ItemProvider
            key={id}
            id={id}
            layout={layout}
            info={info}
            components={components}
          >
            {element}
          </ItemProvider>
        )
      })}
      {dragPlaceholder && (
        <DragPlaceholder
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            ...dragPlaceholder,
          }}
        />
      )}
    </div>
  )
}

const ItemProvider = ({ children, id, layout, info, components }) => {
  const item = useApply(utils.toItem, [id, layout])
  const style = useApply(utils.toBoxCSS, utils.toBounds, [item, info])

  const [dragRef, dragPreview] = useDraggable(item)

  return (
    <Item
      dragRef={dragRef}
      dragPreview={dragPreview}
      style={style}
      components={components}
    >
      {children}
    </Item>
  )
}

const useDraggable = item => {
  const [preview, setPreview] = useState(null)

  const onStart = useCallback(() => item, [item])

  const onMove = useCallback((transfer, { clientX: x, clientY: y }) => {
    setPreview({
      x,
      y,
    })
  }, [])

  const onEnd = useCallback(() => setPreview(null), [])

  const ref = useDrag("box", {
    onStart,
    onMove,
    onEnd,
  })

  return [ref, preview]
}

const useDroppable = (container, info, { onStep }) => {
  const onOver = useCallback(
    ({ x, y, w, h }, { pageX, pageY }) => {
      if (!container) return

      // depending on type will have different over behavior?

      // TODO: implement drag specific functions for that case
      const left = pageX - container.left
      const top = pageY - container.top

      const round = v => Math.ceil(v) - 1

      const pointX = round(left / info.minWidth)
      const pointY = round(top / info.minHeight)

      // const range = v => v <= 0 ? 0 : v >= x && v < x + w ? x : v >= info.cols - w ? info.cols - w : v

      const nextX = utils.range(pointX, 0, info.cols - w)
      const nextY = utils.range(pointY, 0, info.rows - h)

      console.log(nextX, nextY, x, y)

      const coords = {
        x: nextX,
        y: nextY,
        w,
        h,
      }

      onStep(utils.toBoxCSS(utils.toBounds(coords, info)))
    },
    [container, info, onStep]
  )
  const onEnter = useCallback(transfer => console.log("enter", transfer), [])
  const onLeave = useCallback(transfer => console.log("leave"), [])

  // angle type is not needed here, resize will be in a drag handler
  return useDrop(["box", "card"], { onEnter, onOver, onLeave })
}

const getOffset = node => {
  const { left, top, width, height } = node.getBoundingClientRect()

  return {
    width,
    height,
    left: left + window.scrollX,
    top: top + window.scrollY,
  }
}
