import React from "react"
import styles from "./index.scss"

export default function Editor({ children, selectedModule, onClose }) {
  return Editor.renderRoot(
    <Editor.Elements selectedModule={selectedModule} onClose={onClose}>
      {children}
    </Editor.Elements>
  )
}

Editor.Elements = function EditorElements({
  children,
  selectedModule,
  onClose,
}) {
  return (
    <>
      <div className={styles.header}>
        <button onClick={onClose}>Close</button>
      </div>
      <div className={styles.modules}>
        {selectedModule || "All modules list"}
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
