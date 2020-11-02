import { v4 as uuid } from "uuid"
import { useMutation, mutations } from "packages/client"
import { SORTABLE_INNER, SORTABLE_OUTER } from "packages/grid"
import { dict } from "packages/modules"
import { sanitizePositions } from "./utils"

// TODO: make sure there is nothing left from old layout naming conventions.
// TODO: most likely keep grill logic here and call lower level functions from editor here.
// TODO: why called prevLayout?
export const useChangeGrid = (prevLayout) => {
  const [, createModule] = useMutation(mutations.createModule)
  const [, updateLayout] = useMutation(mutations.updateLayout)

  // TODO: handle "leave" event
  return (event) => {
    /**
     * Renaming grill's "layout" to "positions" to avoid confusion between application layout
     * and "react-grill" layout.
     */
    const positions = event.layout

    /**
     * Update layout positions when items are sorted, resized or put on
     * a layout.
     */
    if (
      ["sort", "resize"].includes(event.name) ||
      (event.name === "enter" && event.sourceType === SORTABLE_INNER)
    ) {
      updateLayout({
        layoutId: prevLayout.id,
        positions: sanitizePositions(positions),
      })
      return
    }

    /**
     * Create new module from the stock.
     */
    if (event.name === "enter" && event.sourceType === SORTABLE_OUTER) {
      const { moduleType } = event.custom
      const { outer, ...filtered } = positions

      const moduleId = uuid()

      createModule({
        moduleId,
        layoutId: prevLayout.id,
        type: moduleType,
        name: "test",
        config: dict[moduleType].defaultConfig,
        positions: sanitizePositions({ ...filtered, [moduleId]: outer }),
      })
      return
    }
  }
}
