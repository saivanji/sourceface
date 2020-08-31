import React, { useRef, useState, useEffect } from "react"
import Provider, { useWrapped } from "./Provider"
import * as utils from "./utils"
import { Box, Item } from "./components"
import Lines from "./Lines"
import useDraggable from "./useDraggable"
import useDroppable from "./useDroppable"
import useLayout from "./useLayout"

export default function GridRoot(props) {
  const isWrapped = useWrapped()
  const grid = <Grid {...props} />

  return !isWrapped ? <Provider>{grid}</Provider> : grid
}

function Grid({
  className,
  style,
  cols = 10,
  rows = 10,
  rowHeight = 20,
  isStatic,
  layout: initialLayout,
  renderItem,
  onChange,
  components = {},
}) {
  const [containerWidth, setContainerWidth] = useState(null)
  const [layout, updateLayout, resetLayout] = useLayout(initialLayout)
  const info = utils.toInfo(cols, rows, containerWidth, rowHeight)

  const containerRef = useRef()
  const [dropRef, isOver, overItem] = useDroppable(
    containerRef,
    initialLayout,
    info,
    updateLayout,
    resetLayout,
    onChange
  )

  useEffect(() => {
    setContainerWidth(containerRef.current.offsetWidth)
  }, [])

  return (
    <div
      ref={combineRefs(containerRef, dropRef)}
      style={{ ...style, position: "relative", height: info.containerHeight }}
      className={className}
    >
      {containerWidth && isOver && <Lines info={info} />}
      {Object.keys(layout).map(id => {
        const content = renderItem(layout[id].data, id)

        if (!containerWidth || isStatic) {
          return (
            <Box
              key={id}
              style={utils.toPercentageCSS(layout[id], info)}
              components={components}
            >
              {content}
            </Box>
          )
        }

        return (
          <ItemProvider
            key={id}
            isPicked={overItem?.id === id && isOver}
            id={id}
            layout={layout}
            info={info}
            components={components}
          >
            {content}
          </ItemProvider>
        )
      })}
    </div>
  )
}

function ItemProvider({ children, isPicked, id, layout, info, components }) {
  const [dragRef, isDragging] = useDraggable(
    id,
    layout,
    info,
    children,
    components
  )

  const bounds = utils.toBounds(layout[id], info)
  const style = {
    ...utils.toBoxCSS(bounds),
    /**
     * Preventing cases when dragged grid is hovered on itself.
     */
    ...(isDragging && { pointerEvents: "none" }),
  }

  return (
    <Item
      dragRef={dragRef}
      style={style}
      isPicked={isPicked}
      components={components}
    >
      {children}
    </Item>
  )
}

const combineRefs = (containerRef, dropRef) => (...args) => {
  containerRef.current = args[0]
  return dropRef(...args)
}
