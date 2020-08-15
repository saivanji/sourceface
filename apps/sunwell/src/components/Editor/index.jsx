import React, { useState } from "react"
import { useMutation } from "urql"
import { GrillProvider } from "packages/grid"
import * as stock from "packages/modules"
import Configuration from "../Configuration"
import Stock from "../Stock"
import Modules from "../Modules"
import View from "./View"
import * as schema from "./schema"
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
    <GrillProvider>
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
    </GrillProvider>
  )
}

const useChange = (selectedId, onModuleRemove) => {
  const [, createModule] = useMutation(schema.createModule)
  const [{ fetching: isRemovingModule }, removeModule] = useMutation(
    schema.removeModule
  )
  const [{ fetching: isUpdatingModule }, updateModule] = useMutation(
    schema.updateModule
  )
  const [{ fetching: isUpdatingGrid }, updatePositions] = useMutation(
    schema.updatePositions
  )

  // TODO: implement debouncing
  const handleModuleUpdate = (key, value) =>
    updateModule({ moduleId: selectedId, key, value })

  const handleModuleRemove = async () => {
    await removeModule({ moduleId: selectedId })
    onModuleRemove()
  }

  const handleGridChange = (event, layoutId) => {
    if (["leave", "drag", "resize"].includes(event.name)) {
      // TODO: in case of "leave" - push input value to context, so in future it can be combined with "enter" input and sent to server
      updatePositions({
        positions: toPositionsRequest(layoutId, event.layout),
      })
      return
    }

    if (event.name === "enter" && event.sourceType === "outer") {
      const { moduleType } = event.transfer
      const { outer, ...layout } = event.layout
      const position = { layoutId, ...outer }

      createModule({
        type: moduleType,
        config: stock.dict[moduleType].defaultConfig,
        position,
        positions: toPositionsRequest(layoutId, layout),
      })
    }
  }

  return {
    isChanging: isUpdatingGrid || isUpdatingModule || isRemovingModule,
    updateModule: handleModuleUpdate,
    removeModule: handleModuleRemove,
    changeGrid: handleGridChange,
  }
}
