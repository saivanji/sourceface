import React, { useState } from "react"
import { v4 as uuid } from "uuid"
import { useMutation } from "urql"
import Configuration from "../Configuration"
import Stock from "../Stock"
import Modules from "../Modules"
import View from "./View"
import * as mutations from "schema/mutations"

export default function Editor({ layout, modules, onClose }) {
  const [selectedId, setSelectedId] = useState(null)
  const removeSelection = () => setSelectedId(null)

  const selectedModule = selectedId && modules?.find((x) => x.id === selectedId)

  const {
    isChanging,
    removeModule,
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
      />
    </View>
  )
}

const useChange = (selectedId, onModuleRemove) => {
  const [{ fetching: isRemovingModule }, removeModule] = useMutation(
    mutations.removeModule
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

  const handleModuleRemove = async () => {
    await removeModule({ moduleId: selectedId })
    onModuleRemove()
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
      isRemovingModule ||
      isCreatingAction ||
      isChangingActionConfig ||
      isRemovingAction,
    removeModule: handleModuleRemove,
    createAction: handleActionCreate,
    changeActionConfig: handleActionConfigChange,
    removeAction: handleActionRemove,
  }
}
