import React, { useRef, useState, useEffect, useCallback } from "react"
import { useDrag, DndProvider } from "../dnd"
import { useApply } from "./hooks"
import * as utils from "./utils"
import Item from "./Item"

// TODO: render droppable focus for the "box" type

export default props => {
  const isWrapped = false
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
  const [container, setContainer] = useState(null)
  const info = useApply(utils.toInfo, [cols, rows, container?.width, rowHeight])
  const layout = initialLayout
  const ids = useApply(Object.keys, [layout])

  const containerRef = useRef()

  useEffect(() => {
    setContainer(containerRef.current.getBoundingClientRect())
  }, [])

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", height: info.containerHeight }}
      className={className}
    >
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
            container={container}
            components={components}
          >
            {element}
          </ItemProvider>
        )
      })}
    </div>
  )
}

const ItemProvider = ({
  children,
  id,
  layout,
  info,
  container,
  components,
}) => {
  const style = useApply(utils.toBoxCSS, utils.toBounds, [layout[id], info])

  const [dragRef, dragPreview] = useDraggable(container)

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

const useDraggable = container => {
  const [preview, setPreview] = useState(null)

  const onMove = useCallback(
    (transfer, { clientX, clientY }) => {
      setPreview({
        x: clientX - container.x,
        y: clientY - container.y,
      })
    },
    [container]
  )

  const onEnd = useCallback(() => setPreview(null), [])

  const ref = useDrag("box", {
    onMove,
    onEnd,
  })

  return [ref, preview]
}

const useDroppable = () => {}
