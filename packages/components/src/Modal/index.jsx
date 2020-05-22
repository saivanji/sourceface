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
    <styles.Root {...props} onClick={() => onDismiss()} isPortal={!!portalId}>
      <styles.Container onClick={e => e.stopPropagation()} size={size}>
        {children}
      </styles.Container>
    </styles.Root>
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
    <styles.Row {...props} isHeader>
      {iconBefore && <styles.HeaderIcon>{iconBefore}</styles.HeaderIcon>}
      <styles.Title>{children}</styles.Title>
      <styles.Close>
        <CloseIcon onClick={onDismiss} />
      </styles.Close>
    </styles.Row>
  )
}

Modal.Body = function Body({ children, ...props }) {
  return <styles.Row {...props}>{children}</styles.Row>
}

Modal.Footer = function Footer({ children, ...props }) {
  return (
    <styles.Row {...props} isFooter>
      <styles.Actions>
        {React.Children.toArray(children).map((action, i) => (
          <styles.Action key={i}>{action}</styles.Action>
        ))}
      </styles.Actions>
    </styles.Row>
  )
}
