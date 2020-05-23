import React, { createContext, useRef, useEffect, useContext } from "react"
import { createPortal } from "react-dom"
import CloseIcon from "./assets/close.svg"
import * as styles from "./index.styles"

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
      css={[styles.root, !portalId && styles.overlay]}
    >
      <div
        onClick={e => e.stopPropagation()}
        css={[styles.container, styles.sizesVariants[size]]}
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
    <div {...props} css={[styles.row, styles.header]}>
      {iconBefore && <span css={styles.headerIcon}>{iconBefore}</span>}
      <h4 css={styles.title}>{children}</h4>
      <button css={styles.close}>
        <CloseIcon onClick={onDismiss} />
      </button>
    </div>
  )
}

Modal.Body = function Body({ children, ...props }) {
  return (
    <div {...props} css={styles.row}>
      {children}
    </div>
  )
}

Modal.Footer = function Footer({ children, ...props }) {
  return (
    <div {...props} css={[styles.row, styles.footer]}>
      <div css={styles.actions}>
        {React.Children.toArray(children).map((action, i) => (
          <div css={styles.action} key={i}>
            {action}
          </div>
        ))}
      </div>
    </div>
  )
}
