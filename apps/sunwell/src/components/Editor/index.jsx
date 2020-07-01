import React from "react"
import styles from "./index.scss"

export default function Editor({ children, selectedModule, onCancel }) {
  return Editor.renderRoot(
    <Editor.Elements selectedModule={selectedModule} onCancel={onCancel}>
      {children}
    </Editor.Elements>
  )
}

Editor.Elements = function EditorElements({
  children,
  selectedModule,
  onCancel,
}) {
  return (
    <>
      <div className={styles.header}>
        <button onClick={onCancel}>Cancel</button>
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
