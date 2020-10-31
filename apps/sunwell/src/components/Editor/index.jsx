import React, { useState } from "react"
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

  const { isChanging, changeActionConfig } = useChange()

  return (
    <View
      isSaving={isChanging}
      right={
        selectedModule ? (
          <Configuration
            module={selectedModule}
            onModuleRemove={removeSelection}
            onActionConfigChange={changeActionConfig}
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

const useChange = () => {
  const [
    { fetching: isChangingActionConfig },
    changeActionConfig,
  ] = useMutation(mutations.changeActionConfig)

  const handleActionConfigChange = async (actionId, key, value) => {
    await changeActionConfig({ actionId, key, value })
  }

  return {
    isChanging: isChangingActionConfig,
    changeActionConfig: handleActionConfigChange,
  }
}
