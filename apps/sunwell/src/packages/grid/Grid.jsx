import React, {
  useRef,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react"
import { useWrapped, useRegister } from "./Provider"
import { useDrop, DndProvider } from "../dnd"
import { useApply } from "./hooks"
import * as utils from "./utils"
import { Item, OuterItem } from "./components"
import Lines from "./Lines"
import useDraggable from "./useDraggable"
import useDroppable from "./useDroppable"
import useResizable from "./useResizable"
import useLayout from "./useLayout"

// TODO: When grid item is moved fast on drag start - it disappears

export default props => {
  const isWrapped = useWrapped()
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
  renderItem,
  onChange,
  components = {},
}) {
  const changeId = useRegister(onChange)
  const [container, setContainer] = useState(null)
  const info = useApply(utils.toInfo, [cols, rows, container?.width, rowHeight])
  const [
    layout,
    isEditingLayout,
    onLayoutEdit,
    onLayoutUpdate,
    onLayoutReset,
  ] = useLayout(initialLayout)

  const [containerRef, dropping] = useDroppable(
    initialLayout,
    layout,
    container,
    info,
    changeId,
    {
      onLayoutEdit,
      onLayoutUpdate,
      onLayoutReset,
      onChange,
    }
  )

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

        const content = renderItem(layout[id].data, id)

        if (!container?.width || isStatic) {
          return (
            <Item
              key={id}
              isStatic
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
            initialLayout={initialLayout}
            layout={layout}
            info={info}
            container={container}
            components={components}
            isDraggedOver={dropping?.type === "inner" && dropping?.id === id}
            onLayoutEdit={onLayoutEdit}
            onLayoutUpdate={onLayoutUpdate}
            onLayoutReset={onLayoutReset}
            onChange={onChange}
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
  initialLayout,
  layout,
  info,
  components,
  container,
  isDraggedOver,
  onLayoutEdit,
  onLayoutUpdate,
  onLayoutReset,
  onChange,
}) => {
  const style = useApply(utils.toBoxCSS, utils.toBounds, [layout[id], info])

  const [dragRef, dragPreviewStyle] = useDraggable(id, layout, info, container)
  const [nwRef, swRef, neRef, seRef, resizePreviewStyle] = useResizable(
    id,
    initialLayout,
    layout,
    info,
    {
      onLayoutEdit,
      onLayoutUpdate,
      onLayoutReset,
      onChange,
    }
  )

  return (
    <Item
      dragRef={dragRef}
      nwRef={nwRef}
      swRef={swRef}
      neRef={neRef}
      seRef={seRef}
      isDraggedOver={isDraggedOver}
      dragPreviewStyle={dragPreviewStyle}
      resizePreviewStyle={resizePreviewStyle}
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
