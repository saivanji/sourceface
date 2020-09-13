import React, { useState } from "react"
import { SORTABLE_INNER, SORTABLE_OUTER } from "packages/grid"
import { useMutation } from "urql"
import * as stock from "packages/modules"
import Configuration from "../Configuration"
import Stock from "../Stock"
import Modules from "../Modules"
import View from "./View"
import * as mutatations from "schema/mutations"
import { toPositionsRequest } from "./utils"

export default function Editor({ layout, modules, onClose }) {
  const [selectedId, setSelectedId] = useState(null)
  const removeSelection = () => setSelectedId(null)

  const { isChanging, updateModule, removeModule, changeGrid } = useChange(
    selectedId,
    removeSelection
  )

  return (
    <View
      isSaving={isChanging}
      right={
        selectedId ? (
          <Configuration
            modules={modules}
            selectedId={selectedId}
            onUpdate={updateModule}
            onRemove={removeModule}
          />
        ) : (
          <Stock />
        )
      }
      onClose={onClose}
    >
      <Modules
        layout={layout}
        modules={modules}
        isEditing
        selectedId={selectedId}
        onModuleClick={setSelectedId}
        onChange={changeGrid}
        onConfigChange={updateModule}
      />
    </View>
  )
}

const useChange = (selectedId, onModuleRemove) => {
  const [, createModule] = useMutation(mutatations.createModule)
  const [{ fetching: isRemovingModule }, removeModule] = useMutation(
    mutatations.removeModule
  )
  const [{ fetching: isUpdatingModule }, updateModule] = useMutation(
    mutatations.updateModule
  )
  const [{ fetching: isUpdatingGrid }, updatePositions] = useMutation(
    mutatations.updatePositions
  )

  // TODO: implement debouncing
  const handleModuleUpdate = (key, value) =>
    updateModule({ moduleId: selectedId, key, value })

  const handleModuleRemove = async () => {
    await removeModule({ moduleId: selectedId })
    onModuleRemove()
  }

  const handleGridChange = (event, prevLayer) => {
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
        type: moduleType,
        config: stock.dict[moduleType].defaultConfig,
        position,
        positions: toPositionsRequest(prevLayer, filtered),
      })
      return
    }
  }

  return {
    isChanging: isUpdatingGrid || isUpdatingModule || isRemovingModule,
    updateModule: handleModuleUpdate,
    removeModule: handleModuleRemove,
    changeGrid: handleGridChange,
  }
}
