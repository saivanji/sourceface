import React from "react"
import cx from "classnames"
import { v4 as uuid } from "uuid"
import * as factory from "packages/factory"
import { useMutation, mutations } from "packages/client"
import { SORTABLE_INNER, SORTABLE_OUTER } from "packages/grid"
import { dict } from "packages/modules"
import Grid from "./Grid"
import styles from "./index.scss"
import { createLayer, toPositionsRequest } from "./utils"

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
  onModuleClick,
  onConfigChange,
}) {
  const [, createModule] = useMutation(mutations.createModule)
  const [, updatePositions] = useMutation(mutations.updatePositions)

  const handleChange = (event) => {
    const prevLayer = layer
    const { layoutId } = prevLayer

    /**
     * Update layout positions when items are sorted, resized or put on
     * a layout.
     */
    if (
      ["sort", "resize"].includes(event.name) ||
      (event.name === "enter" && event.sourceType === SORTABLE_INNER)
    ) {
      updatePositions({
        positions: toPositionsRequest(prevLayer, event.units),
      })
      return
    }

    /**
     * Create new module from the stock.
     */
    if (event.name === "enter" && event.sourceType === SORTABLE_OUTER) {
      const { moduleType } = event.custom
      const { outer, ...filtered } = event.units
      const position = { layoutId, ...outer }

      createModule({
        moduleId: uuid(),
        type: moduleType,
        config: dict[moduleType].defaultConfig,
        position,
        positions: toPositionsRequest(prevLayer, filtered),
      })
      return
    }
  }

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
