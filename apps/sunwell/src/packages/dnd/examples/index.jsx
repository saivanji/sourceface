import React, { useState } from "react"
import { DndProvider, useDrag, useDrop } from "../"

const Root = () => {
  const [{ deltaX, deltaY }, setMovement] = useState({})

  const dragRef = useDrag("element", {
    onMove: (data, { deltaX, deltaY }) => {
      setMovement({ deltaX, deltaY })
    },
    onEnd: () => {
      setMovement({})
    },
  })

  return (
    <div>
      <div
        style={{
          margin: 20,
          height: 400,
        }}
      >
        <Area id="parent" normalColor="white" overColor="yellow">
          <div style={{ width: 300, height: 300 }}>
            <Area id="child" normalColor="gray" overColor="green">
              <div style={{ width: 100, height: 100 }}>
                <Area id="child-2" normalColor="gray" overColor="green">
                  Drop here
                </Area>
              </div>
            </Area>
          </div>
        </Area>
      </div>
      <div style={{ margin: 20 }}>
        <span
          ref={dragRef}
          style={{
            padding: 10,
            border: "1px solid #aaa",
            borderRadius: 4,
            cursor: "move",
            display: "inline-block",
            transform:
              deltaX && deltaY && `translate(${deltaX}px, ${deltaY}px)`,
            pointerEvents: deltaX && deltaY && "none",
          }}
        >
          Drag me
        </span>
      </div>
    </div>
  )
}

const Area = ({ id, children, normalColor, overColor }) => {
  const [isOver, setOver] = useState(false)

  const dropRef = useDrop(["element"], {
    onEnter: () => {
      console.log("enter", id)
      setOver(true)
    },
    onLeave: () => {
      console.log("leave", id)
      setOver(false)
    },
    onOver: () => {
      console.log("over", id)
    },
    onDrop: () => {
      setOver(false)
    },
  })

  return (
    <div
      ref={dropRef}
      style={{
        border: "1px solid",
        padding: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        backgroundColor: isOver ? overColor : normalColor,
      }}
    >
      {children}
    </div>
  )
}

export default () => {
  return (
    <DndProvider>
      <Root />
    </DndProvider>
  )
}
