import React, { useState } from "react"
import { ShiftedProvider, useDrag, useDrop } from "../"

const Component = () => {
  const [{ deltaX, deltaY }, setMovement] = useState({})

  const dragRef = useDrag("element", {
    onMove: (data, { deltaX, deltaY }) => {
      setMovement({ deltaX, deltaY })
    },
    onEnd: () => {
      setMovement({})
    },
  })

  const dropRef = useDrop(["element"], {
    onEnter: (data, { clientY }) => {
      return {
        dropStartY: clientY,
      }
    },
    onHover: ({ dropStartY }, { clientY, startY }) => {
      const dropDeltaY = clientY - (dropStartY || startY)

      console.log(dropDeltaY)
    },
  })

  return (
    <ShiftedProvider>
      <div
        ref={dragRef}
        style={{
          transform: deltaX && deltaY && `translate(${deltaX}px, ${deltaY}px)`,
          pointerEvents: deltaX && deltaY && "none",
        }}
      >
        Drag me
      </div>
      <div
        ref={dropRef}
        style={{
          border: "1px solid",
          padding: 10,
          display: "flex",
          alignItems: "center",
          height: 200,
        }}
      >
        Drop here
      </div>
    </ShiftedProvider>
  )
}

export default () => {
  return (
    <ShiftedProvider>
      <Component />
    </ShiftedProvider>
  )
}
