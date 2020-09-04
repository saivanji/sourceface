import React, { useState } from "react"
import { SORTABLE_INNER, SORTABLE_OUTER } from "../../packages/grid"
import { useMutation } from "urql"
import * as stock from "packages/modules"
import Configuration from "../Configuration"
import Stock from "../Stock"
import Modules from "../Modules"
import View from "./View"
import * as mutatations from "schema/mutations"
import { toPositionsRequest, findModule } from "./utils"

export default function Editor({ children, modules, onClose }) {
  const [selectedId, setSelectedId] = useState(null)
  const removeSelection = () => setSelectedId(null)

  const { isChanging, updateModule, removeModule, changeGrid } = useChange(
    selectedId,
    removeSelection
  )
  const selectedModule =
    modules && selectedId && findModule(selectedId, modules)

  return (
    <View
      isSaving={isChanging}
      right={
        selectedModule ? (
          <Configuration
            module={selectedModule}
            onUpdate={updateModule}
            onRemove={removeModule}
          />
        ) : (
          <Stock />
        )
      }
      onClose={onClose}
    >
      <Modules.Provider
        isEditing
        selectedId={selectedId}
        onModuleClick={setSelectedId}
        onChange={changeGrid}
      >
        {children}
      </Modules.Provider>
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

  const handleGridChange = (event, layoutId) => {
    if (
      ["sort", "resize"].includes(event.name) ||
      (event.name === "enter" && event.sourceType === SORTABLE_INNER)
    ) {
      console.log(layoutId, event.layout)
      // Issues with moving item from one grid to another:
      // TODO: either enter or leave event is handled wrong, since on both events we send the similar list of positions
      // TODO: make sure reordering is handled optimistically
      // TODO: cache is updated incorrectly after reordering
      // TODO: send only changed positions and not all positions in a layout
      updatePositions({
        positions: toPositionsRequest(layoutId, event.layout),
      })
      return
    }

    if (event.name === "enter" && event.sourceType === SORTABLE_OUTER) {
      const { moduleType } = event.custom
      const { outer, ...layout } = event.layout
      const position = { layoutId, ...outer }

      createModule({
        type: moduleType,
        config: stock.dict[moduleType].defaultConfig,
        position,
        positions: toPositionsRequest(layoutId, layout),
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
