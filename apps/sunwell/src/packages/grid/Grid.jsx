import React, { useRef, useState, useEffect } from "react"
import Provider, { useWrapped } from "./Provider"
import * as utils from "./utils"
import { Box, Item } from "./components"
import Lines from "./Lines"
import useDraggable from "./useDraggable"
import useDroppable from "./useDroppable"

export default props => {
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
  layout,
  renderItem,
  onChange,
  components = {},
}) {
  const [containerWidth, setContainerWidth] = useState(null)
  const info = utils.toInfo(cols, rows, containerWidth, rowHeight)

  const containerRef = useRef()
  const [dropRef, isOver, overItem] = useDroppable()

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
            isDragging={overItem?.id === id && isOver}
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

const ItemProvider = ({
  children,
  isDragging,
  id,
  layout,
  info,
  components,
}) => {
  const bounds = utils.toBounds(layout[id], info)
  const style = utils.toBoxCSS(bounds)

  const [dragRef] = useDraggable(id, children, bounds, components)

  return (
    <Item
      dragRef={dragRef}
      style={style}
      isDragging={isDragging}
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
