import React, { useState, useEffect, useCallback } from "react"
import { ShiftedProvider, useDrag, useDrop } from "../react-shifted"
import { useApply, useLifecycle } from "./hooks"
import * as utils from "./utils"
import Lines from "./Lines"
import Item from "./Item"

export default props => (
  <ShiftedProvider>
    <Grid {...props} />
  </ShiftedProvider>
)

function Grid({
  className,
  cols = 10,
  rows = 10,
  rowHeight = 20,
  isDraggable = true,
  isResizable = true,
  layout,
  children,
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
  const [motion, onMotionStart, onMotion, onMotionEnd] = useMotion()

  const onDragOverWrap = useLifecycle(onDragOver, over(info, onChange), [
    info,
    onChange,
  ])

  const containerRef = useDrop(["box", "angle"], {
    onOver: onDragOverWrap,
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
      {React.Children.map(children, element => {
        const id = element.key

        if (!containerWidth || (!isDraggable && !isResizable)) {
          return (
            <Item
              style={utils.toPercentageCSS(layout[id], info)}
              components={components}
            >
              {element}
            </Item>
          )
        }

        return (
          <ItemProvider
            id={id}
            layout={layout}
            info={info}
            motion={motion}
            isDraggable={isDraggable}
            isResizable={isResizable}
            components={components}
            onChange={onChange}
            onMotionStart={onMotionStart}
            onMotion={onMotion}
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

const useMotion = () => {
  const [motion, setMotion] = useState(null)

  const onMotionStart = useCallback(
    (id, type, previewStyle) => setMotion({ id, type, previewStyle }),
    []
  )
  const onMotion = useCallback(
    bounds =>
      setMotion(motion => ({
        ...motion,
        previewStyle: utils.toPreviewStyle(bounds),
      })),
    []
  )
  const onMotionEnd = useCallback(() => setMotion(null), [])

  return [motion, onMotionStart, onMotion, onMotionEnd]
}

const useDraggable = ({
  id,
  layout,
  info,
  onMotionStart,
  onMotion,
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
  const onDragWrap = useLifecycle(onDrag, move(utils.drag, info, onMotion), [
    info,
    onMotion,
  ])
  const onDragEndWrap = useLifecycle(onDragEnd, onMotionEnd, [])

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
    layout,
    info,
    onChange,
    onMotionStart,
    onMotion,
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
    change((...args) => utils.resize(angle, ...args), info, onChange, onMotion),
    [info, onChange]
  )

  const onResizeEndWrap = useLifecycle(onResizeEnd, onMotionEnd, [])

  return useDrag("angle", {
    onStart: onResizeStartWrap,
    onMove: onResizeWrap,
    onEnd: onResizeEndWrap,
  })
}

const start = (type, id, layout, info, onStart) => () => {
  const unit = layout[id]
  const bounds = utils.toBounds(unit, info)

  onStart(id, type, bounds)

  return {
    id,
    type,
    coords: unit,
    initial: layout,
    anchor: bounds,
  }
}

const move = (fn, info, onMove) => ({ anchor }, { deltaX, deltaY }) => {
  const nextBounds = fn(deltaX, deltaY, anchor, info)
  onMove(nextBounds)
}

const over = (info, onChange) => ({ type, ...transfer }, event) => {
  // there will be only drag on over, since resize should happen only within current drop target
  if (type === "drag")
    return change(utils.drag, info, onChange)(transfer, event)
}

const change = (fn, info, onChange, onTick) => (
  { id, coords: prevCoords, initial, anchor },
  { deltaX, deltaY }
) => {
  const nextBounds = fn(deltaX, deltaY, anchor, info)
  const nextCoords = utils.toCoords(nextBounds, info)

  onTick && onTick(nextBounds)

  if (utils.coordsEqual(prevCoords, nextCoords)) return

  onChange && onChange(utils.put(id, nextCoords, initial))

  return {
    coords: nextCoords,
  }
}
