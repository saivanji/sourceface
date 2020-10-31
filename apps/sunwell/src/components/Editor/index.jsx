import React, { useState } from "react"
import Configuration from "../Configuration"
import Stock from "../Stock"
import Modules from "../Modules"
import styles from "./index.scss"

// near the orders page will be a button opening a modal to edit current page properties(url, etc?)
// page title is editable?
// page creation button could be near page title, also page title is a select which has all pages inside
export default function Editor({ layout, modules, onClose }) {
  const [selectedId, setSelectedId] = useState(null)
  const removeSelection = () => setSelectedId(null)

  const selectedModule = selectedId && modules?.find((x) => x.id === selectedId)

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <span className={styles.title}>Orders page</span>
        <div>mobile | tablet | desktop</div>
        <div>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
      <div className={styles.right}>
        {selectedModule ? (
          <Configuration
            module={selectedModule}
            onModuleRemove={removeSelection}
          />
        ) : (
          <Stock />
        )}
      </div>
      <div className={styles.body}>
        <div className={styles.content}>
          <Modules
            layout={layout}
            modules={modules}
            isEditing
            selectedId={selectedId}
            onModuleClick={setSelectedId}
          />
        </div>
      </div>
    </div>
  )
}
