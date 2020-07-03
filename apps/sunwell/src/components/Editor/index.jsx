import React from "react"
import styles from "./index.scss"

export default function Editor({ children, configuration, onClose }) {
  return Editor.renderRoot(
    <Editor.Elements configuration={configuration} onClose={onClose}>
      {children}
    </Editor.Elements>
  )
}

Editor.Elements = function EditorElements({
  children,
  isLoadingModules,
  configuration,
  onClose,
}) {
  return (
    <>
      <div className={styles.header}>
        <button onClick={onClose}>Close</button>
      </div>
      <div className={styles.modules}>
        {isLoadingModules ? "Loading..." : configuration || "All modules list"}
      </div>
      {children && Editor.renderChildren(children)}
    </>
  )
}

Editor.renderRoot = element => {
  return <div className={styles.root}>{element}</div>
}

Editor.renderChildren = element => {
  return <div className={styles.body}>{element}</div>
}
