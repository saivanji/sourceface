import React, {
  useRef,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react"
import { context } from "./Provider"
import { useDrop, DndProvider } from "../dnd"
import { useApply } from "./hooks"
import * as utils from "./utils"
import { Item, OuterItem, Content } from "./components"
import Lines from "./Lines"
import useDraggable from "./useDraggable"
import useDroppable from "./useDroppable"
import useLayout from "./useLayout"

// There are two independent parts:
// 1. Drag preview - need to figure out how to display drag preview across the boards
// 2. Drop - positioning of the elements
// Drop logic can be implemented independently from the drag

export default props => {
  const isWrapped = useContext(context)
  const grid = <Grid {...props} />

  return !isWrapped ? <DndProvider>{grid}</DndProvider> : grid
}

function Grid({
  className,
  style = {},
  cols = 10,
  rows = 10,
  rowHeight = 20,
  isStatic,
  layout: initialLayout,
  onChange,
  components = {},
}) {
  const [container, setContainer] = useState(null)
  const info = useApply(utils.toInfo, [cols, rows, container?.width, rowHeight])

  const [
    layout,
    isEditingLayout,
    onLayoutEdit,
    onLayoutUpdate,
    onLayoutReset,
  ] = useLayout(initialLayout)

  const [containerRef, dropping] = useDroppable(layout, container, info, {
    onLayoutEdit,
    onLayoutUpdate,
    onLayoutReset,
  })

  useEffect(() => {
    setContainer(getOffset(containerRef.current))
  }, [])

  return (
    <div
      ref={containerRef}
      style={{ ...style, position: "relative", height: info.containerHeight }}
      className={className}
    >
      {container && isEditingLayout && <Lines info={info} />}
      {Object.keys(layout).map(id => {
        if (dropping?.type === "outer" && dropping?.id === id) {
          return (
            <OuterItemProvider
              key={id}
              id={id}
              layout={layout}
              info={info}
              components={components}
            />
          )
        }

        const content = (
          <Content data={layout[id].data} components={components} />
        )

        if (!container?.width || isStatic) {
          return (
            <Item
              key={id}
              style={utils.toPercentageCSS(layout[id], info)}
              components={components}
            >
              {content}
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
            isDragging={dropping?.type === "inner" && dropping?.id === id}
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
  id,
  layout,
  info,
  components,
  container,
  isDragging,
}) => {
  const style = useApply(utils.toBoxCSS, utils.toBounds, [layout[id], info])

  const [dragRef, dragPreviewStyle] = useDraggable(id, layout, info, container)

  return (
    <Item
      dragRef={dragRef}
      dragPreviewStyle={dragPreviewStyle}
      isDragging={isDragging}
      style={style}
      components={components}
    >
      {children}
    </Item>
  )
}

const OuterItemProvider = ({ id, layout, info, components }) => {
  const style = useApply(utils.toBoxCSS, utils.toBounds, [layout[id], info])

  return <OuterItem style={style} components={components} />
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
