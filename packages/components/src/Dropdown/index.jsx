import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react"
import cx from "classnames"
import styles from "./index.scss"

const context = createContext()

export default function Dropdown({ children, className, ...props }) {
  const [isOpened, setOpened] = useState(false)
  const close = useCallback(() => setOpened(false), [setOpened])
  const toggle = useCallback(() => setOpened(!isOpened), [isOpened, setOpened])
  const buttonRef = useRef()
  const menuRef = useRef()

  return (
    <context.Provider value={{ isOpened, toggle, close, buttonRef, menuRef }}>
      <div {...props} className={cx(styles.root, className)}>
        {children}
      </div>
    </context.Provider>
  )
}

Dropdown.Trigger = function Trigger({ children, className, ...props }) {
  const { toggle, buttonRef } = useContext(context)

  return (
    <div {...props} className={className} ref={buttonRef} onClick={toggle}>
      {children}
    </div>
  )
}

// TODO: remove in favor of future implemented list component? same for Item?
Dropdown.Menu = function Menu({
  children,
  position = "bottomRight",
  className,
  ...props
}) {
  const { isOpened, close, buttonRef, menuRef } = useContext(context)
  const onClickOutside = useCallback(
    event =>
      menuRef.current &&
      !menuRef.current.contains(event.target) &&
      !buttonRef.current.contains(event.target) &&
      event.target !== buttonRef.current &&
      close(),
    [menuRef, buttonRef, close]
  )

  useEffect(() => {
    document.addEventListener("mousedown", onClickOutside)

    return () => {
      document.removeEventListener("mousedown", onClickOutside)
    }
  })

  return (
    isOpened && (
      <div
        {...props}
        ref={menuRef}
        className={cx(styles.menu, styles[position], className)}
      >
        {children}
      </div>
    )
  )
}

// TODO implement Title component

Dropdown.Item = function Item({ children, onClick, className, ...props }) {
  const { close } = useContext(context)

  return (
    <div
      {...props}
      className={cx(styles.item, className)}
      onClick={() => {
        close()

        if (onClick) {
          onClick()
        }
      }}
    >
      {children}
    </div>
  )
}
