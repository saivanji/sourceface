import React, { forwardRef, useRef, useState, useEffect } from "react"
import Provider, { useWrapped } from "./Provider"
import * as utils from "./utils"
import { Box, Item, OuterItem } from "./components"
import Lines from "./Lines"
import * as itemTypes from "./itemTypes"
import { useSort, useSortArea } from "./sortable"
import { useResize, useResizeArea } from "./resizable"

// react-infinite-grid
// react-deep-grid
// react-nested-grid
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
  const [sortArea, isSortOver, overItem, overItemType] = useSortArea(
    containerRef,
    initialLayout,
    info,
    updateLayout,
    resetLayout,
    onChange
  )
  const [resizeArea, isResizeOver] = useResizeArea(
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
    <Wrap
      ref={containerRef}
      sortArea={sortArea}
      resizeArea={resizeArea}
      style={{ ...style, position: "relative", height: info.containerHeight }}
      className={className}
    >
      {containerWidth && (isSortOver || isResizeOver) && <Lines info={info} />}
      {Object.keys(layout).map(id => {
        if (overItemType === itemTypes.SORTABLE_OUTER && overItem.id === id) {
          const style = utils.toBoxCSS(utils.toBounds(layout[id], info))
          return <OuterItem key={id} style={style} components={components} />
        }

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
            isPicked={overItem?.id === id && isSortOver}
            id={id}
            layout={layout}
            info={info}
            components={components}
          >
            {content}
          </ItemProvider>
        )
      })}
    </Wrap>
  )
}

// TODO: when unmounting a component which is using drag as reference - extra node
// is rendered in the end of a document. See that issue as a reference:
// https://github.com/react-dnd/react-dnd/issues/2745
function ItemProvider({ children, isPicked, id, layout, info, components }) {
  /**
   * Using reference for resize preview so it can be rendered from a Layer using portal
   * to hide it under overflow when resize is performed while scrolling the grid.
   */
  const resizePreviewRef = useRef()

  const [sort, isSorting] = useSort(id, layout, info, children, components)
  const [nw, sw, ne, se, isResizing] = useResize(
    id,
    layout,
    info,
    children,
    components,
    resizePreviewRef
  )

  const bounds = utils.toBounds(layout[id], info)
  const style = {
    ...utils.toBoxCSS(bounds),
    /**
     * Preventing cases when dragged grid is hovered on itself.
     */
    ...(isSorting && { pointerEvents: "none" }),
  }

  return (
    <>
      <Item
        connect={[sort, nw, sw, ne, se]}
        style={style}
        isPicked={isPicked}
        isResizing={isResizing}
        components={components}
      >
        {children}
      </Item>
      <div ref={resizePreviewRef} />
    </>
  )
}

/**
 * When item position is changed, it's always put on the initial layout to avoid messing up
 * the layout while item is dragged.
 *
 * To achieve that, we have intermediate layout which we update during drag operation for displaying
 * the recent state to the user.
 *
 */
const useLayout = function Layout(initialLayout) {
  const [layout, update] = useState(null)

  const reset = () => update(null)

  return [layout || initialLayout, update, reset]
}

/**
 * It seems there is no way to assign multiple drop targets to one DOM node, so using a
 * separate node for each connector.
 */
const Wrap = forwardRef(function Wrap(
  { children, style, className, sortArea, resizeArea },
  ref
) {
  const childStyle = {
    height: "100%",
  }

  return (
    <div style={style} className={className} ref={ref}>
      <div style={childStyle} ref={sortArea}>
        <div style={childStyle} ref={resizeArea}>
          {children}
        </div>
      </div>
    </div>
  )
})
