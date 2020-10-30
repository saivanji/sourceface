import React, { useState } from "react"
import { v4 as uuid } from "uuid"
import { useMutation } from "urql"
import { SORTABLE_INNER, SORTABLE_OUTER } from "packages/grid"
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
    changeActionConfig,
    removeAction,
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
            onActionConfigChange={changeActionConfig}
            onActionRemove={removeAction}
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
  const [
    { fetching: isChangingActionConfig },
    changeActionConfig,
  ] = useMutation(mutations.changeActionConfig)
  const [{ fetching: isRemovingAction }, removeAction] = useMutation(
    mutations.removeAction
  )

  // TODO: implement debouncing
  const handleModuleUpdate = async (key, value) => {
    await updateModule({ moduleId: selectedId, key, value })
  }

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
        moduleId: uuid(),
        type: moduleType,
        config: dict[moduleType].defaultConfig,
        position,
        positions: toPositionsRequest(prevLayer, filtered),
      })
      return
    }
  }

  const handleActionCreate = async (type) => {
    const { data } = await createAction({
      actionId: uuid(),
      moduleId: selectedId,
      type,
      config: {},
    })

    return data.createAction
  }

  const handleActionConfigChange = async (actionId, key, value) => {
    await changeActionConfig({ actionId, key, value })
  }

  const handleActionRemove = async (actionId) => {
    await removeAction({ actionId })
  }

  return {
    isChanging:
      isUpdatingPositions ||
      isUpdatingModule ||
      isRemovingModule ||
      isCreatingAction ||
      isChangingActionConfig ||
      isRemovingAction,
    updateModule: handleModuleUpdate,
    removeModule: handleModuleRemove,
    changeGrid: handleGridChange,
    createAction: handleActionCreate,
    changeActionConfig: handleActionConfigChange,
    removeAction: handleActionRemove,
  }
}
