import React, { useState } from "react"
import { SORTABLE_INNER, SORTABLE_OUTER } from "packages/grid"
import { useMutation } from "urql"
import { dict } from "packages/modules"
import Configuration from "../Configuration"
import Stock from "../Stock"
import Modules from "../Modules"
import View from "./View"
import * as mutations from "schema/mutations"
import { toPositionsRequest } from "./utils"

export default function Editor({ layout, modules, onClose }) {
  const [selectedId, setSelectedId] = useState(null)
  const removeSelection = () => setSelectedId(null)

  const selectedModule = selectedId && modules?.find((x) => x.id === selectedId)

  const {
    isChanging,
    updateModule,
    removeModule,
    changeGrid,
    createAction,
  } = useChange(selectedId, removeSelection)

  return (
    <View
      isSaving={isChanging}
      right={
        selectedModule ? (
          <Configuration
            module={selectedModule}
            onUpdate={updateModule}
            onRemove={removeModule}
            onActionCreate={createAction}
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
  const [, createModule] = useMutation(mutations.createModule)
  const [{ fetching: isRemovingModule }, removeModule] = useMutation(
    mutations.removeModule
  )
  const [{ fetching: isUpdatingModule }, updateModule] = useMutation(
    mutations.updateModule
  )
  const [{ fetching: isUpdatingPositions }, updatePositions] = useMutation(
    mutations.updatePositions
  )
  const [{ fetching: isCreatingAction }, createAction] = useMutation(
    mutations.createAction
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
        config: dict[moduleType].defaultConfig,
        position,
        positions: toPositionsRequest(prevLayer, filtered),
      })
      return
    }
  }

  const handleActionCreate = (type) =>
    createAction({ moduleId: selectedId, type, config: {} })

  return {
    isChanging:
      isUpdatingPositions ||
      isUpdatingModule ||
      isRemovingModule ||
      isCreatingAction,
    updateModule: handleModuleUpdate,
    removeModule: handleModuleRemove,
    changeGrid: handleGridChange,
    createAction: handleActionCreate,
  }
}
