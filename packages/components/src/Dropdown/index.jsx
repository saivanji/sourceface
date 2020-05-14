import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react"
import cx from "classnames"
import styles from "./index.css"

const Context = createContext("dropdown")

export default function Dropdown({ children, className }) {
  const [isOpened, setOpened] = useState(false)
  const close = useCallback(() => setOpened(false), [setOpened])
  const toggle = useCallback(() => setOpened(!isOpened), [isOpened, setOpened])
  const buttonRef = useRef()
  const menuRef = useRef()

  return (
    <Context.Provider value={{ isOpened, toggle, close, buttonRef, menuRef }}>
      <div className={cx(styles.root, className)}>{children}</div>
    </Context.Provider>
  )
}

Dropdown.Trigger = function Trigger({ children, className }) {
  const { toggle, buttonRef } = useContext(Context)

  return (
    <div className={className} ref={buttonRef} onClick={toggle}>
      {children}
    </div>
  )
}

// TODO: move to list component
Dropdown.Menu = function Menu({
  children,
  position = "bottomRight",
  className,
}) {
  const { isOpened, close, buttonRef, menuRef } = useContext(Context)
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
        ref={menuRef}
        className={cx(styles.menu, styles[position], className)}
      >
        {children}
      </div>
    )
  )
}

Dropdown.Item = function Item({ children, onClick, className }) {
  const { close } = useContext(Context)

  return (
    <div
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
