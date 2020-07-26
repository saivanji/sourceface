import React, { useState, useEffect, useCallback } from "react"
import { ShiftedProvider, useDrag, useDrop } from "../react-shifted"
import { useApply, useLifecycle } from "./hooks"
import * as utils from "./utils"
import Lines from "./Lines"
import { Awaiting, Motion } from "./components"

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

  const containerRef = useDrop(["box"], {
    onOver: () => {
      // TODO: should not print null at first call
      // console.log(motion)
    },
  })

  const onMotionStart = (id, type) => setMotion({ id, type })
  const onMotion = previewStyle =>
    setMotion(motion => ({ ...motion, previewStyle }))
  const onMotionEnd = () => setMotion(null)

  const onDragStartWrap = useLifecycle(onDragStart, onMotionStart, [])
  const onDragWrap = useLifecycle(onDrag, onMotion, [])
  const onDragEndWrap = useLifecycle(onDragEnd, onMotionEnd, [])

  const onResizeStartWrap = useLifecycle(onResizeStart, onMotionStart, [])
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
            <Awaiting
              style={utils.toPercentageCSS(layout[id], info)}
              components={components}
            >
              {element}
            </Awaiting>
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
  // onResizeStart,
  // onResizeEnd,
}) => {
  const style = useApply(utils.toBoxCSS, utils.toBounds, [layout[id], info])

  const dragRef = useDraggable(id, layout, info, {
    onStart: onDragStart,
    onMove: onDrag,
    onEnd: onDragEnd,
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

  if (motion?.id === id) {
    const isDragging = motion.type === "drag"
    const isResizing = motion.type === "resize"

    return (
      <Motion
        style={style}
        isDraggable={isDraggable}
        isResizable={isResizable}
        isDragging={isDragging}
        isResizing={isResizing}
        components={components}
      >
        {children}
      </Motion>
    )
  }

  return (
    <Awaiting
      dragRef={dragRef}
      style={style}
      isDraggable={isDraggable}
      isResizable={isResizable}
      isDragging={false}
      isResizing={false}
      components={components}
    >
      {children}
    </Awaiting>
  )
}

// TODO: drag is triggered only first time
const useDraggable = (id, layout, info, { onStart, onMove, onEnd }) => {
  const unit = layout[id]
  const bounds = useApply(utils.toBounds, [unit, info])

  const onStartWrap = useCallback(
    start("drag", id, layout, unit, bounds, onStart),
    [id, layout, unit, bounds, onStart]
  )

  const onMoveWrap = useCallback(move(utils.drag, info, onMove), [])

  const ref = useDrag("box", {
    onStart: onStartWrap,
    onMove: onMoveWrap,
    onEnd,
  })

  return ref
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

//   const nwRef = useDrag("angle", {
//     onStart: onStartWrap,
//     onEnd,
//   })

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

const start = (type, id, layout, coords, bounds, onStart) => () => {
  onStart(id, type)
  return {
    id,
    type,
    coords,
    initial: layout,
    anchor: bounds,
  }
}

const move = (fn, info, onMove) => ({ anchor }, { deltaX, deltaY }) => {
  const nextBounds = fn(deltaX, deltaY, anchor, info)
  const nextCoords = utils.toCoords(nextBounds, info)
  onMove(utils.toBoxCSS(nextBounds))
}

// TODO: have 2 functions. move and over
const over = (fn, id, info, onMove, onChange, setPreviewStyle) => (
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
