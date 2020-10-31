import { v4 as uuid } from "uuid"
import { useMutation, mutations } from "packages/client"
import { SORTABLE_INNER, SORTABLE_OUTER } from "packages/grid"
import { dict } from "packages/modules"
import { toPositionsRequest } from "./utils"

export const useChangeGrid = (prevLayer) => {
  const [, createModule] = useMutation(mutations.createModule)
  const [, updatePositions] = useMutation(mutations.updatePositions)

  return (event) => {
    const { layoutId } = prevLayer
    /**
     * Renaming "layout" to "units" to avoid confusion between application layout
     * and "react-grill" layout.
     */
    const units = event.layout

    /**
     * Update layout positions when items are sorted, resized or put on
     * a layout.
     */
    if (
      ["sort", "resize"].includes(event.name) ||
      (event.name === "enter" && event.sourceType === SORTABLE_INNER)
    ) {
      updatePositions({
        positions: toPositionsRequest(prevLayer, units),
      })
      return
    }

    /**
     * Create new module from the stock.
     */
    if (event.name === "enter" && event.sourceType === SORTABLE_OUTER) {
      const { moduleType } = event.custom
      const { outer, ...filtered } = units
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
}
