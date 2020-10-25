import React from "react"
import cx from "classnames"
import * as factory from "packages/factory"
import Grid from "./Grid"
import styles from "./index.scss"
import { createLayer } from "./utils"

export default function Modules({ layout, modules, ...props }) {
  const layer = layout && createLayer(layout, modules)
  const isLoaded = !!layout

  return !isLoaded ? "Loading..." : <Frame layer={layer} {...props} />
}

// TODO: get some props from context provided from Editor? (explore git history for the additional context)
// since that component is used inside another modules and there is no another way to get this data
function Frame({
  layer,
  isEditing,
  selectedId,
  onChange,
  onModuleClick,
  onConfigChange,
}) {
  /**
   * Passing down event and previous layer.
   */
  const handleChange = (event) => onChange(event, layer)

  return (
    <Grid
      units={layer.units}
      isEditable={isEditing}
      onChange={handleChange}
      renderItem={(module) => {
        const isSelected = isEditing && selectedId === module.id

        return (
          <div
            onClick={(e) => {
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
            <factory.Module
              module={module}
              frame={Frame}
              isEditing={isEditing}
              onConfigChange={onConfigChange}
            />
          </div>
        )
      }}
    />
  )
}
