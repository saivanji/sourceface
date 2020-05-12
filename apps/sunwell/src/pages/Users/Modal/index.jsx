import React, { createContext, useRef, useEffect, useContext } from "react"
import { createPortal } from "react-dom"
import cx from "classnames"
import styles from "./index.css"
import CloseIcon from "./assets/close.svg"

const Context = createContext("modal")

export default function Modal({
  children,
  portalId,
  isOpened,
  onDismiss,
  size = "normal",
}) {
  const portalRef = useRef()

  useEffect(() => {
    portalRef.current = document.getElementById(portalId)
  }, [portalId])

  const modal = (
    <div
      onClick={() => onDismiss()}
      className={cx(styles.root, !portalId && styles.overlay)}
    >
      <div
        onClick={e => e.stopPropagation()}
        className={cx(styles.container, styles[size])}
      >
        {children}
      </div>
    </div>
  )

  return (
    isOpened && (
      <Context.Provider value={{ onDismiss }}>
        {portalId ? createPortal(modal, portalRef.current) : modal}
      </Context.Provider>
    )
  )
}

export function ModalHeader({ children, iconBefore }) {
  const { onDismiss } = useContext(Context)

  return (
    <div className={cx(styles.row, styles.header)}>
      {iconBefore && <span className={styles.headerIcon}>{iconBefore}</span>}
      <h4 className={styles.title}>{children}</h4>
      <CloseIcon onClick={onDismiss} className={styles.closeIcon} />
    </div>
  )
}

export function ModalBody({ children }) {
  return <div className={styles.row}>{children}</div>
}

export function ModalFooter({ children }) {
  return (
    <div className={cx(styles.row, styles.footer)}>
      <div className={styles.actions}>
        {React.Children.toArray(children).map((action, i) => (
          <div className={styles.action} key={i}>
            {action}
          </div>
        ))}
      </div>
    </div>
  )
}
