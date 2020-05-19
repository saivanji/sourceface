import React, { createContext, useRef, useEffect, useContext } from "react"
import { createPortal } from "react-dom"
import cx from "classnames"
import CloseIcon from "./assets/close.svg"
import styles from "./index.scss"

const Context = createContext("modal")

export default function Modal({
  children,
  portalId,
  isOpened,
  onDismiss,
  size = "normal",
  ...props
}) {
  const portalRef = useRef()

  useEffect(() => {
    if (portalId) {
      portalRef.current = document.getElementById(portalId)
    }
  }, [portalId])

  const modal = (
    <div
      {...props}
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

Modal.Header = function Header({ children, iconBefore, ...props }) {
  const { onDismiss } = useContext(Context)

  return (
    <div {...props} className={cx(styles.row, styles.header)}>
      {iconBefore && <span className={styles.headerIcon}>{iconBefore}</span>}
      <h4 className={styles.title}>{children}</h4>
      <button className={styles.close}>
        <CloseIcon onClick={onDismiss} />
      </button>
    </div>
  )
}

Modal.Body = function Body({ children, ...props }) {
  return (
    <div {...props} className={styles.row}>
      {children}
    </div>
  )
}

Modal.Footer = function Footer({ children, ...props }) {
  return (
    <div {...props} className={cx(styles.row, styles.footer)}>
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
