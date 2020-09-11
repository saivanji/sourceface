import React from "react"
import cx from "classnames"
import * as stock from "packages/modules"
import Grid from "./Grid"
import styles from "./index.scss"

export default function Modules({
  layout,
  isEditing,
  selectedId,
  onChange,
  onModuleClick,
  onConfigChange,
}) {
  /**
   * Passing down event and previous layout.
   */
  const handleChange = event => onChange(event, layout)
  const components = {
    Modules,
  }

  return !layout ? (
    "Loading..."
  ) : (
    <Grid
      positions={layout.positions}
      isEditable={isEditing}
      onChange={handleChange}
      renderItem={module => {
        const isSelected = isEditing && selectedId === module.id
        const Component = stock.dict[module.type].Root

        return (
          <div
            key={module.id}
            onClick={e => {
              if (onModuleClick) {
                /**
                 * Propagating click events in order to be able to click on nested module
                 */
                e.stopPropagation()
                onModuleClick(module.id)
              }
            }}
            className={cx(
              styles.module,
              isEditing && styles.editing,
              isSelected && styles.selected
            )}
          >
            <Component
              config={module.config}
              layouts={module.layouts}
              components={components}
              isEditing={isEditing}
              onConfigChange={onConfigChange}
            />
          </div>
        )
      }}
    />
  )
}
