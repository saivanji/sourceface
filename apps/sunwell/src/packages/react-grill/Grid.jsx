import React, { useState, useEffect, useRef, useCallback } from "react"
import { ShiftedProvider, useDrag } from "../react-shifted"
import { useApply, useLifecycle } from "./hooks"
import * as utils from "./utils"
import Lines from "./Lines"
import Box from "./Box"

export default function Grid({
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
  onDragEnd,
  onResizeStart,
  onResize,
  onResizeEnd,
  components = {},
}) {
  const [containerWidth, setContainerWidth] = useState()
  const [change, setChange] = useState(null)
  const containerRef = useRef()
  const info = useApply(utils.toInfo, [cols, rows, containerWidth, rowHeight])

  const start = type => id => setChange({ id, type })
  const end = () => setChange(null)

  const onDragStartWrap = useLifecycle(onDragStart, start("drag"), [])
  const onDragEndWrap = useLifecycle(onDragEnd, end, [])
  const onResizeStartWrap = useLifecycle(onDragStart, start("resize"), [])
  const onResizeEndWrap = useLifecycle(onResizeEnd, end, [])

  useEffect(() => {
    setContainerWidth(containerRef.current.offsetWidth)
  }, [])

  return (
    <ShiftedProvider>
      <div
        ref={containerRef}
        style={{ position: "relative", height: info.containerHeight }}
        className={className}
      >
        {change && <Lines info={info} />}
        {React.Children.map(children, element => {
          if (!containerWidth || (!isDraggable && !isResizable)) {
            return (
              <Box
                style={utils.toPercentageCSS(layout[element.key], info)}
                components={components}
              >
                {element}
              </Box>
            )
          }

          return (
            <BoxProvider
              key={element.key}
              isDraggable={isDraggable}
              isResizable={isResizable}
              id={element.key}
              layout={layout}
              info={info}
              change={change}
              onChange={onChange}
              onDragStart={onDragStartWrap}
              onDrag={onDrag}
              onDragEnd={onDragEndWrap}
              onResizeStart={onResizeStartWrap}
              onResize={onResize}
              onResizeEnd={onResizeEndWrap}
              components={components}
            >
              {element}
            </BoxProvider>
          )
        })}
      </div>
    </ShiftedProvider>
  )
}

const BoxProvider = ({
  children,
  isDraggable,
  isResizable,
  id,
  layout,
  info,
  change,
  components,
  onChange,
  onDragStart,
  onDrag,
  onDragEnd,
  onResizeStart,
  onResize,
  onResizeEnd,
}) => {
  const style = useApply(utils.toBoxCSS, utils.toBounds, [layout[id], info])
  const isDragging = change?.type === "drag" && change?.id === id
  const isResizing = change?.type === "resize" && change?.id === id

  const [dragRef, dragPreviewStyle] = useDraggable(id, layout, info, {
    onStart: onDragStart,
    onMove: onDrag,
    onEnd: onDragEnd,
    onChange,
  })

  const [nwRef, swRef, neRef, seRef, resizePreviewStyle] = useResizable(
    id,
    layout,
    info,
    {
      onStart: onResizeStart,
      onMove: onResize,
      onEnd: onResizeEnd,
      onChange,
    }
  )

  return (
    <Box
      nwRef={nwRef}
      swRef={swRef}
      neRef={neRef}
      seRef={seRef}
      dragRef={dragRef}
      isDraggable={isDraggable}
      isResizable={isResizable}
      style={style}
      dragPreviewStyle={dragPreviewStyle}
      resizePreviewStyle={resizePreviewStyle}
      isDragging={isDragging}
      isResizing={isResizing}
      components={components}
    >
      {children}
    </Box>
  )
}

const useDraggable = (
  id,
  layout,
  info,
  { onStart, onMove, onEnd, onChange }
) => {
  const unit = layout[id]
  const bounds = useApply(utils.toBounds, [unit, info])
  const [previewStyle, setPreviewStyle] = useState(utils.toBoxCSS(bounds))

  const onStartWrap = useCallback(start(id, layout, unit, bounds, onStart), [
    id,
    layout,
    unit,
    bounds,
    onStart,
  ])

  const onMoveWrap = useCallback(
    move(utils.drag, id, info, onMove, onChange, setPreviewStyle),
    [id, info, onMove]
  )

  const ref = useDrag("box", {
    onMove: onMoveWrap,
    onStart: onStartWrap,
    onEnd,
  })

  return [ref, previewStyle]
}

const useResizable = (
  id,
  layout,
  info,
  { onStart, onMove, onEnd, onChange }
) => {
  const unit = layout[id]
  const bounds = useApply(utils.toBounds, [unit, info])
  const [previewStyle, setPreviewStyle] = useState(utils.toBoxCSS(bounds))

  const onStartWrap = useCallback(start(id, layout, unit, bounds, onStart), [
    id,
    layout,
    unit,
    bounds,
    onStart,
  ])

  const onNwMoveWrap = useResizeMove(
    "nw",
    id,
    info,
    onMove,
    onChange,
    setPreviewStyle
  )
  const onSwMoveWrap = useResizeMove(
    "sw",
    id,
    info,
    onMove,
    onChange,
    setPreviewStyle
  )
  const onNeMoveWrap = useResizeMove(
    "ne",
    id,
    info,
    onMove,
    onChange,
    setPreviewStyle
  )
  const onSeMoveWrap = useResizeMove(
    "se",
    id,
    info,
    onMove,
    onChange,
    setPreviewStyle
  )

  const nwRef = useDrag("angle", {
    onMove: onNwMoveWrap,
    onStart: onStartWrap,
    onEnd,
  })

  const swRef = useDrag("angle", {
    onMove: onSwMoveWrap,
    onStart: onStartWrap,
    onEnd,
  })

  const neRef = useDrag("angle", {
    onMove: onNeMoveWrap,
    onStart: onStartWrap,
    onEnd,
  })

  const seRef = useDrag("angle", {
    onMove: onSeMoveWrap,
    onStart: onStartWrap,
    onEnd,
  })

  return [nwRef, swRef, neRef, seRef, previewStyle]
}

const useResizeMove = (angle, id, info, onMove, onChange, setPreviewStyle) =>
  useCallback(
    move(
      (...args) => utils.resize(angle, ...args),
      id,
      info,
      onMove,
      onChange,
      setPreviewStyle
    ),
    [id, info, onMove, onChange]
  )

const start = (id, layout, coords, bounds, onStart) => () => {
  onStart(id)
  return {
    coords,
    initial: layout,
    anchor: bounds,
  }
}

const move = (fn, id, info, onMove, onChange, setPreviewStyle) => (
  { coords: prevCoords, initial, anchor },
  { deltaX, deltaY }
) => {
  onMove && onMove()

  const nextBounds = fn(deltaX, deltaY, anchor, info)
  const nextCoords = utils.toCoords(nextBounds, info)
  setPreviewStyle(utils.toBoxCSS(nextBounds))

  if (utils.coordsEqual(prevCoords, nextCoords)) return

  onChange && onChange(utils.put(id, nextCoords, initial))

  return {
    coords: nextCoords,
  }
}
