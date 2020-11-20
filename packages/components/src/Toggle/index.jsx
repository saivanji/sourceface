import React, { useState, useRef, useEffect } from "react"
import cx from "classnames"
import styles from "./index.scss"

export default function Toggle({
  children,
  className,
  trigger,
  position = "bottomLeft",
}) {
  const [isOpened, setOpened] = useState(false)
  const toggle = () => setOpened(!isOpened)
  const close = () => setOpened(false)

  const triggerRef = useRef()
  const bodyRef = useRef()

  const onClickOutside = (event) =>
    bodyRef.current &&
    !bodyRef.current.contains(event.target) &&
    !triggerRef.current.contains(event.target) &&
    event.target !== triggerRef.current &&
    close()

  useEffect(() => {
    document.addEventListener("mouseup", onClickOutside)

    return () => {
      document.removeEventListener("mouseup", onClickOutside)
    }
  })

  return (
    <div className={cx(styles.root, className)}>
      <div ref={triggerRef} onClick={toggle}>
        {typeof trigger === "function" ? trigger(isOpened) : trigger}
      </div>
      {isOpened && (
        <div
          ref={bodyRef}
          className={cx(styles.body, className, styles[position])}
        >
          {typeof children === "function" ? children(close) : children}
        </div>
      )}
    </div>
  )
}
