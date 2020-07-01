import React from "react"
import { Breadcrumbs } from "packages/kit/index"
import styles from "./index.scss"

// dashboard frame component containing Header component and so on
export default function Frame({ children, path, actions }) {
  return Frame.renderRoot(
    <Frame.Elements path={path} actions={actions}>
      {children}
    </Frame.Elements>
  )
}

Frame.Elements = function FrameElements({ path, actions, children }) {
  return (
    <>
      <div className={styles.pane}>
        <Breadcrumbs path={path} />
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
      {children && Frame.renderChildren(children)}
    </>
  )
}

Frame.renderRoot = element => {
  return <div className={styles.root}>{element}</div>
}

Frame.renderChildren = element => {
  return <div>{element}</div>
}
