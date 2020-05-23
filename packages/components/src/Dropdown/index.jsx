import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react"
import * as styles from "./index.styles"

const Context = createContext("dropdown")

export default function Dropdown({ children, ...props }) {
  const [isOpened, setOpened] = useState(false)
  const close = useCallback(() => setOpened(false), [setOpened])
  const toggle = useCallback(() => setOpened(!isOpened), [isOpened, setOpened])
  const buttonRef = useRef()
  const menuRef = useRef()

  return (
    <Context.Provider value={{ isOpened, toggle, close, buttonRef, menuRef }}>
      <div {...props} css={styles.root}>
        {children}
      </div>
    </Context.Provider>
  )
}

Dropdown.Trigger = function Trigger({ children, ...props }) {
  const { toggle, buttonRef } = useContext(Context)

  return (
    <div {...props} ref={buttonRef} onClick={toggle}>
      {children}
    </div>
  )
}

// TODO: remove in favor of future implemented list component? same for Item?
Dropdown.Menu = function Menu({
  children,
  position = "bottomRight",
  ...props
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
        {...props}
        ref={menuRef}
        css={[styles.menu, styles.positions[position]]}
      >
        {children}
      </div>
    )
  )
}

// TODO implement Title component

Dropdown.Item = function Item({ children, onClick, ...props }) {
  const { close } = useContext(Context)

  return (
    <div
      {...props}
      css={styles.item}
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
