import React from "react"
import styles from "./index.scss"

export default function Editor({ children, configuration, onClose }) {
  return Editor.renderRoot(
    <Editor.Elements configuration={configuration} onClose={onClose}>
      {children}
    </Editor.Elements>
  )
}

// near the orders page will be a button opening a modal to edit current page properties(url, etc?)
// page title is editable?
// page creation button could be near page title
Editor.Elements = function EditorElements({
  children,
  availableModules,
  isLoadingModules,
  configuration,
  onAddModule,
  onClose,
}) {
  return (
    <>
      <div className={styles.header}>
        Orders page
        <div>mobile | tablet | desktop</div>
        <button onClick={onClose}>Close</button>
      </div>
      <div className={styles.modules}>
        {isLoadingModules
          ? "Loading..."
          : configuration ||
            availableModules.map(({ type }) => (
              <div key={type} onClick={() => onAddModule(type)}>
                {type}
              </div>
            ))}
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
