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
  const [motion, setMotion] = useState(null)
  const info = useApply(utils.toInfo, [cols, rows, containerWidth, rowHeight])

  const onDragOverWrap = useLifecycle(onDragOver, over(info, onChange), [
    info,
    onChange,
  ])

  const containerRef = useDrop(["box", "angle"], {
    onOver: onDragOverWrap,
  })

  const onMotionStart = (id, type, previewStyle) =>
    setMotion({ id, type, previewStyle })
  const onMotion = previewStyle =>
    setMotion(motion => ({ ...motion, previewStyle }))
  const onMotionEnd = () => setMotion(null)

  const onDragStartWrap = useLifecycle(
    onDragStart,
    id => start("drag", id, layout, info, onMotionStart)(),
    [layout, info, onMotionStart]
  )
  const onDragWrap = useLifecycle(onDrag, move(utils.drag, info, onMotion), [
    info,
    onMotion,
  ])
  const onDragEndWrap = useLifecycle(onDragEnd, onMotionEnd, [])

  const onResizeStartWrap = useLifecycle(
    onResizeStart,
    id => start("resize", id, layout, info, onMotionStart)(),
    [layout, info, onMotionStart]
  )
  const onResizeEndWrap = useLifecycle(onResizeEnd, onMotionEnd, [])

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
            onDragStart={onDragStartWrap}
            onDrag={onDragWrap}
            onDragEnd={onDragEndWrap}
            onResizeStart={onResizeStartWrap}
            onResize={onResize}
            onResizeEnd={onResizeEndWrap}
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
  motion,
  isDraggable,
  isResizable,
  components,
  onDragStart,
  onDrag,
  onDragEnd,
  onResizeStart,
  onResizeEnd,
}) => {
  const isDragging = motion?.id === id && motion?.type === "drag"
  const isResizing = motion?.id === id && motion?.type === "resize"
  const style = useApply(utils.toBoxCSS, utils.toBounds, [layout[id], info])

  const onDragStartWrap = useCallback(() => onDragStart(id), [id, onDragStart])

  const dragRef = useDrag("box", {
    onStart: onDragStartWrap,
    onMove: onDrag,
    onEnd: onDragEnd,
  })

  const onResizeStartWrap = useCallback(() => onResizeStart(id), [
    id,
    onResizeStart,
  ])

  const nwRef = useDrag("angle", {
    onStart: onResizeStartWrap,
    onEnd: onResizeEnd,
  })

  //   const [nwRef, swRef, neRef, seRef, resizePreviewStyle] = useResizable(
  //     id,
  //     layout,
  //     info,
  //     {
  //       onStart: onResizeStart,
  //       onEnd: onResizeEnd,
  //     }
  //   )

  return (
    <Item
      dragRef={dragRef}
      nwRef={nwRef}
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

// const useResizable = (id, layout, info, { onStart, onEnd }) => {
//   const unit = layout[id]
//   const bounds = useApply(utils.toBounds, [unit, info])

//   const onStartWrap = useCallback(
//     start("resize", id, layout, unit, bounds, onStart),
//     [id, layout, unit, bounds, onStart]
//   )

//   // const onNwMoveWrap = useResizeMove(
//   //   "nw",
//   //   id,
//   //   info,
//   //   onMove,
//   //   onChange,
//   //   setPreviewStyle
//   // )
//   // const onSwMoveWrap = useResizeMove(
//   //   "sw",
//   //   id,
//   //   info,
//   //   onMove,
//   //   onChange,
//   //   setPreviewStyle
//   // )
//   // const onNeMoveWrap = useResizeMove(
//   //   "ne",
//   //   id,
//   //   info,
//   //   onMove,
//   //   onChange,
//   //   setPreviewStyle
//   // )
//   // const onSeMoveWrap = useResizeMove(
//   //   "se",
//   //   id,
//   //   info,
//   //   onMove,
//   //   onChange,
//   //   setPreviewStyle
//   // )

//   const swRef = useDrag("angle", {
//     onStart: onStartWrap,
//     onEnd,
//   })

//   const neRef = useDrag("angle", {
//     onStart: onStartWrap,
//     onEnd,
//   })

//   const seRef = useDrag("angle", {
//     onStart: onStartWrap,
//     onEnd,
//   })

//   return [nwRef, swRef, neRef, seRef]
// }

// const useResizeMove = (angle, id, info, onMove, onChange, setPreviewStyle) =>
//   useCallback(
//     move(
//       (...args) => utils.resize(angle, ...args),
//       id,
//       info,
//       onMove,
//       onChange,
//       setPreviewStyle
//     ),
//     [id, info, onMove, onChange]
//   )

const start = (type, id, layout, info, onStart) => () => {
  const unit = layout[id]
  const bounds = utils.toBounds(unit, info)
  const previewStyle = toPreviewStyle(bounds)

  onStart(id, type, previewStyle)

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
  onMove(toPreviewStyle(nextBounds))
}

const over = (info, onChange) => (
  { id, type, coords: prevCoords, initial, anchor },
  { deltaX, deltaY }
) => {
  // there will be only drag on over, since resize should happen only within current drop target
  if (type !== "drag") return

  const nextBounds = utils.drag(deltaX, deltaY, anchor, info)
  const nextCoords = utils.toCoords(nextBounds, info)

  if (utils.coordsEqual(prevCoords, nextCoords)) return

  onChange && onChange(utils.put(id, nextCoords, initial))

  return {
    coords: nextCoords,
  }
}

const toPreviewStyle = bounds => ({
  ...utils.toBoxCSS(bounds),
  pointerEvents: "none",
})
