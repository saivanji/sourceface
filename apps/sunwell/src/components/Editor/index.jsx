import React, { useRef, cloneElement } from "react"
import cx from "classnames"
import { useClickOutside } from "hooks/index"
import Configuration from "../Configuration"
import Stock from "../Stock"
import Modules from "../Modules"
import { useEditor } from "packages/factory"
import styles from "./index.scss"

// near the orders page will be a button opening a modal to edit current page properties(url, etc?)
// page title is editable?
// page creation button could be near page title, also page title is a select which has all pages inside
export default function Editor() {
  const { isDirty, save, selected, edit } = useEditor()
  const bodyRef = useRef()

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <span className={styles.title}>Orders page</span>
        <div>mobile | tablet | desktop</div>
        <div>
          {isDirty && (
            <>
              <button onClick={() => save()}>Save</button>{" "}
            </>
          )}
          <button onClick={() => edit(false)}>Close</button>
        </div>
      </div>
      <div className={styles.right}>
        {selected ? <Configuration /> : <Stock />}
      </div>
      <div ref={bodyRef} className={styles.body}>
        <div className={styles.content}>
          <Modules
            renderItem={(node, id) => (
              <EditableModule scopeRef={bodyRef} id={id}>
                {node}
              </EditableModule>
            )}
          />
        </div>
      </div>
    </div>
  )
}

const EditableModule = ({ children, scopeRef, id }) => {
  const { select, selected } = useEditor()
  const ref = useRef()
  const isSelected = selected?.id === id

  useClickOutside(ref, scopeRef, () => isSelected && select(null))

  return cloneElement(children, {
    ref,
    onClick: (e) => {
      if (isSelected) return

      /**
       * Propagating click events in order to be able to click on nested module
       */
      e.stopPropagation()
      select(id)
    },
    className: cx(
      children.props.className,
      styles.editing,
      isSelected && styles.selected
    ),
  })
}
