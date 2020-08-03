// order creation will be in a modal

import React, { createContext, useState } from "react"
import { keys } from "ramda"
import { useQuery, useMutation } from "urql"
import camelcaseKeys from "camelcase-keys"
import { useBooleanState } from "hooks/index"
import { Editor, Frame, Grid, Module, Modules } from "components/index"
import * as modules from "packages/modules"
import * as expression from "./expression"
import * as schema from "./schema"
import Configuration from "./Configuration"
import { createLayout, reverseLayout } from "./utils"

/* <div className={styles.panel}> */
/*   <span className={styles.title}>Orders</span> */
/*   <Button className={styles.newOrder}>New order</Button> */
/* </div> */

const path = [
  { title: "Administration", link: "#" },
  { title: "Users", link: "#" },
]

const modulesMap = camelcaseKeys(modules)
const modulesTypes = keys(modulesMap)

export const context = createContext({})
// TODO: think about real use case

// TODO: handle error on back-end requests
export default () => {
  const [result] = useQuery({
    query: schema.root,
  })
  const [isEditing, editOn, editOff] = useBooleanState(false)

  return (
    <context.Provider value={result.data}>
      {isEditing ? (
        <EditorProvider modules={result.data?.modules} onClose={editOff} />
      ) : (
        <Frame path={path} actions={<button onClick={editOn}>Edit</button>}>
          <GridProvider isEditing={false} modules={result.data?.modules} />
        </Frame>
      )}
    </context.Provider>
  )
}

function EditorProvider({ modules, onClose }) {
  const [selectedId, setSelectedId] = useState(null)
  const [, addModule] = useMutation(schema.addModule)

  const handleModuleClick = type =>
    addModule({ type, config: modulesMap[type].defaultValues })

  return (
    <Editor
      right={
        selectedId ? (
          <ConfigurationProvider id={selectedId} modules={modules} />
        ) : (
          <Modules types={modulesTypes} onModuleClick={handleModuleClick} />
        )
      }
      onClose={onClose}
    >
      <GridProvider
        isEditing
        modules={modules}
        selectedId={selectedId}
        onModuleClick={setSelectedId}
      />
    </Editor>
  )
}

function ConfigurationProvider({ id, modules }) {
  const module = modules?.find(m => m.id === id)

  return !module ? (
    "Loading..."
  ) : (
    <Configuration
      module={module}
      component={modulesMap[module.type].Configuration}
    />
  )
}

function GridProvider({ modules, isEditing, selectedId, onModuleClick }) {
  const [, updateModulesPositions] = useMutation(schema.updateModulesPositions)
  const layout = modules && createLayout(modules)
  const onUpdateModulesPositions = layout =>
    updateModulesPositions({ positions: reverseLayout(layout) })

  return !layout ? (
    "Loading..."
  ) : (
    <Grid
      layout={layout}
      isEditable={isEditing}
      onChange={onUpdateModulesPositions}
      renderItem={module => (
        <Module
          key={module.id}
          isEditable={isEditing}
          isSelected={isEditing && selectedId === module.id}
          data={module}
          expression={expression}
          component={modulesMap[module.type]}
          onClick={onModuleClick}
        />
      )}
    />
  )
}
