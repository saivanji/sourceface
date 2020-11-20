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

// TODO: rename to Menu

// TODO: remove in favor of future implemented list component? same for Item?
export default function Dropdown({ children, className, size = "regular", ...props }) {
  return (
    <div {...props} className={cx(styles.root, styles[size], className)}>
      {children}
    </div>
  )
}

// TODO implement Title component

Dropdown.Item = function Item({ children, onClick, className, ...props }) {
  return (
    <div
      {...props}
      className={cx(styles.item, className)}
      onClick={() => {
        if (onClick) {
          onClick()
        }
      }}
    >
      {children}
    </div>
  )
}
