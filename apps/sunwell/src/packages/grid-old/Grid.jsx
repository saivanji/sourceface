import React, { useRef, useState, useEffect } from "react"
import Provider, { useWrapped, useRegister } from "./Provider"
import { useApply } from "./hooks"
import * as utils from "./utils"
import { Box, Item, OuterItem } from "./components"
import Lines from "./Lines"
import useDraggable from "./useDraggable"
import useDroppable from "./useDroppable"
import useResizable from "./useResizable"
import useLayout from "./useLayout"

// TODO: When grid item is moved fast on drag start to another grid - it's not adding to the destination grid (looks like when drag happens so fast "onOver" is not called and therefore item is not added)
//
// TODO: When grid item is moved fast outside - it disappears and initial grid keeps edited with initial item visible placeholder(no leave callback called, mouseup called earlier than mouseleave?)
// TODO: When user scrolls page during resize - preview is shifted

export default props => {
  const isWrapped = useWrapped()
  const grid = <Grid {...props} />

  return !isWrapped ? <Provider>{grid}</Provider> : grid
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
  const [containerWidth, setContainerWidth] = useState(null)
  const info = useApply(utils.toInfo, [cols, rows, containerWidth, rowHeight])
  const [
    layout,
    isEditingLayout,
    // rename
    onLayoutEdit,
    onLayoutUpdate,
    onLayoutReset,
  ] = useLayout(initialLayout)

  const containerRef = useRef()

  useEffect(() => {
    setContainerWidth(containerRef.current.offsetWidth)
  }, [])

  return (
    <div
      ref={node => {
        containerRef.current = node
        // dropRef.current = node
      }}
      style={{ ...style, position: "relative", height: info.containerHeight }}
      className={className}
    >
      {containerWidth && isEditingLayout && <Lines info={info} />}
      {Object.keys(layout).map(id => {
        // if (dropping?.type === "outer" && dropping?.id === id) {
        //   return (
        //     <OuterItemProvider
        //       key={id}
        //       id={id}
        //       layout={layout}
        //       info={info}
        //       components={components}
        //     />
        //   )
        // }

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

        // isDraggedOver={dropping?.type === "inner" && dropping?.id === id}
        return (
          <ItemProvider
            key={id}
            id={id}
            containerRef={containerRef}
            initialLayout={initialLayout}
            layout={layout}
            info={info}
            components={components}
            isDraggedOver={false}
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
  containerRef,
  components,
  isDraggedOver,
  onLayoutEdit,
  onLayoutUpdate,
  onLayoutReset,
  onChange,
}) => {
  const style = useApply(utils.toBoxCSS, utils.toBounds, [layout[id], info])

  return (
    <Item
      isDraggedOver={isDraggedOver}
      dragPreviewStyle={null}
      resizePreviewStyle={null}
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
