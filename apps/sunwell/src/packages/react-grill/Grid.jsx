import React, { useContext, useState, useEffect, useCallback } from "react"
import { ShiftedProvider, useDrag, useDrop } from "../react-shifted"
import { useApply, useLifecycle } from "./hooks"
import { context } from "./Provider"
import * as utils from "./utils"
import Lines from "./Lines"
import Item from "./Item"

export default props => {
  const isWrapped = useContext(context)
  const grid = <Grid {...props} />

  return !isWrapped ? <ShiftedProvider>{grid}</ShiftedProvider> : grid
}
// return onItemLeave function for removing the item from the grid

// TODO: pass raw function to useLifecycle. useCallback could be enhanced with higher order functions

// TODO: consider using context for passing parent props down
function Grid({
  className,
  cols = 10,
  rows = 10,
  rowHeight = 20,
  isDraggable = true,
  isResizable = true,
  layout: initialLayout,
  renderItem,
  onChange,
  onDragStart,
  onDrag,
  onDragOver,
  onDragEnd,
  onResizeStart,
  onResize,
  onResizeEnd,
  components = {},
}) {
  const [containerWidth, setContainerWidth] = useState()
  const info = useApply(utils.toInfo, [cols, rows, containerWidth, rowHeight])
  const [
    motion,
    onMotionStart,
    onMotionTick,
    onMotionAlter,
    onMotionEnd,
  ] = useMotion(initialLayout, onChange)
  const layout = motion?.layout || initialLayout
  const ids = useApply(Object.keys, [layout])

  const onDragOverWrap = useLifecycle(
    onDragOver,
    over(initialLayout, info, onMotionAlter),
    [initialLayout, info, onMotionAlter]
  )

  const containerRef = useDrop(["box", "angle"], {
    onOver: onDragOverWrap,
    onLeave: () => {
      console.log("leave")
    },
  })

  useEffect(() => {
    setContainerWidth(containerRef.current.offsetWidth)
  }, [])

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", height: info.containerHeight }}
      className={className}
    >
      {motion && <Lines info={info} />}
      {ids.map(id => {
        const element = renderItem(layout[id].data)

        if (!containerWidth || (!isDraggable && !isResizable)) {
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
            motion={motion}
            isDraggable={isDraggable}
            isResizable={isResizable}
            components={components}
            onMotionStart={onMotionStart}
            onMotionTick={onMotionTick}
            onMotionEnd={onMotionEnd}
            onDragStart={onDragStart}
            onDrag={onDrag}
            onDragEnd={onDragEnd}
            onResizeStart={onResizeStart}
            onResize={onResize}
            onResizeEnd={onResizeEnd}
          >
            {element}
          </ItemProvider>
        )
      })}
    </div>
  )
}

const ItemProvider = props => {
  const {
    children,
    id,
    layout,
    info,
    motion,
    isDraggable,
    isResizable,
    components,
  } = props

  const isDragging = motion?.id === id && motion?.type === "drag"
  const isResizing = motion?.id === id && motion?.type === "resize"
  const style = useApply(utils.toBoxCSS, utils.toBounds, [layout[id], info])

  const dragRef = useDraggable(props)
  const nwRef = useResizable("nw", props)
  const swRef = useResizable("sw", props)
  const neRef = useResizable("ne", props)
  const seRef = useResizable("se", props)

  return (
    <Item
      dragRef={dragRef}
      nwRef={nwRef}
      swRef={swRef}
      neRef={neRef}
      seRef={seRef}
      style={style}
      previewStyle={motion?.previewStyle}
      isDraggable={isDraggable}
      isResizable={isResizable}
      isDragging={isDragging}
      isResizing={isResizing}
      components={components}
    >
      {children}
    </Item>
  )
}

const useMotion = (initialLayout, onChange) => {
  const [motion, setMotion] = useState(null)

  const onStart = useCallback(
    (id, type, previewStyle) => setMotion({ id, type, previewStyle }),
    []
  )
  const onTick = useCallback(
    bounds =>
      setMotion(motion => ({
        ...motion,
        previewStyle: utils.toPreviewStyle(bounds),
      })),
    []
  )
  const onAlter = useCallback(layout =>
    setMotion(motion => ({ ...motion, layout }))
  )
  const onEnd = useCallback(() => {
    onChange(motion.layout)
    setMotion(null)
  }, [motion, onChange])

  return [motion, onStart, onTick, onAlter, onEnd]
}

const useDraggable = ({
  id,
  layout,
  info,
  onMotionStart,
  onMotionTick,
  onMotionEnd,
  onDragStart,
  onDrag,
  onDragEnd,
}) => {
  const onDragStartWrap = useLifecycle(
    onDragStart,
    start("drag", id, layout, info, onMotionStart),
    [id, layout, info, onMotionStart]
  )
  const onDragWrap = useLifecycle(
    onDrag,
    move(utils.drag, info, onMotionTick),
    [info, onMotionTick]
  )
  // TODO: fix
  const onDragEndWrap = useLifecycle(onDragEnd, onMotionEnd, [onMotionEnd])

  return useDrag("box", {
    onStart: onDragStartWrap,
    onMove: onDragWrap,
    onEnd: onDragEndWrap,
  })
}

const useResizable = (
  angle,
  {
    id,
    initialLayout,
    layout,
    info,
    onMotionStart,
    onMotionTick,
    onMotionAlter,
    onMotionEnd,
    onResizeStart,
    onResize,
    onResizeEnd,
  }
) => {
  const onResizeStartWrap = useLifecycle(
    onResizeStart,
    start("resize", id, layout, info, onMotionStart),
    [id, layout, info, onMotionStart]
  )

  const onResizeWrap = useLifecycle(
    onResize,
    alter(
      (...args) => utils.resize(angle, ...args),
      initialLayout,
      info,
      onMotionAlter,
      onMotionTick
    ),
    [info, onMotionAlter, onMotionTick]
  )

  // TODO: fix
  const onResizeEndWrap = useLifecycle(onResizeEnd, onMotionEnd, [onMotionEnd])

  return useDrag("angle", {
    onStart: onResizeStartWrap,
    onMove: onResizeWrap,
    onEnd: onResizeEndWrap,
  })
}

const start = (type, id, layout, info, onStart) => () => {
  const { x, y, w, h, data } = layout[id]
  const coords = { x, y, w, h }
  const bounds = utils.toBounds(coords, info)

  onStart(id, type, bounds)

  return {
    id,
    type,
    data,
    anchor: bounds,
    coords,
  }
}

const move = (fn, info, onMove) => ({ anchor }, { deltaX, deltaY }) => {
  const nextBounds = fn(deltaX, deltaY, anchor, info)
  onMove(nextBounds)
}

const over = (initialLayout, info, onAlter) => (
  { type, ...transfer },
  event
) => {
  // there will be only drag on over, since resize should happen only within current drop target
  if (type === "drag")
    return alter(utils.drag, initialLayout, info, onAlter)(transfer, event)
}

const alter = (fn, initialLayout, info, onAlter, onTick) => (
  { id, data, coords: prevCoords, anchor },
  { deltaX, deltaY }
) => {
  const nextBounds = fn(deltaX, deltaY, anchor, info)
  const nextCoords = utils.toCoords(nextBounds, info)

  onTick && onTick(nextBounds)

  if (utils.coordsEqual(prevCoords, nextCoords)) return

  onAlter(utils.put(id, { ...nextCoords, data }, initialLayout))

  return {
    coords: nextCoords,
  }
}
