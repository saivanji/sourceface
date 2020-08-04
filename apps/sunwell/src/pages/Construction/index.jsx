// order creation will be in a modal

import React, { createContext, useState, useMemo } from "react"
import { values } from "ramda"
import { useQuery, useMutation } from "urql"
import { GrillProvider } from "packages/grid"
import * as modules from "packages/modules"
import { Input, Select, Checkbox } from "packages/kit"
import { useBooleanState } from "hooks/index"
import {
  Configuration,
  Editor,
  Frame,
  Grid,
  Module,
  Modules,
} from "components/index"
import * as expression from "./expression"
import * as schema from "./schema"
import * as form from "./form"
import { createLayout, reverseLayout, transformModules } from "./utils"

/* <div className={styles.panel}> */
/*   <span className={styles.title}>Orders</span> */
/*   <Button className={styles.newOrder}>New order</Button> */
/* </div> */

const path = [
  { title: "Administration", link: "#" },
  { title: "Users", link: "#" },
]

const modulesDict = transformModules(modules)
const modulesList = values(modulesDict)

// TODO: move to "expression.js"
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
  const [{ fetching: isUpdatingModule }, updateModule] = useMutation(
    schema.updateModule
  )
  const [{ fetching: isUpdatingGrid }, updateModulesPositions] = useMutation(
    schema.updateModulesPositions
  )

  // TODO: implement debouncing
  const handleModuleUpdate = (id, key, value) =>
    updateModule({ moduleId: id, key, value })

  const handleGridChange = event => {
    if (event.name === "drag" || event.name === "resize") {
      return updateModulesPositions({ positions: reverseLayout(event.layout) })
    }

    if (event.name === "enter" && event.sourceType === "outer") {
      const { moduleType: type, unit: position } = event.transfer

      // TODO: implement optimistic updates
      // TODO: put all layout on creation because of the collisions(detach layout from modules and send 2 mutations - addModule and updateLayout?)
      addModule({ type, config: modulesDict[type].defaultConfig, position })
    }
  }

  return (
    <GrillProvider>
      <Editor
        isSaving={isUpdatingGrid || isUpdatingModule}
        right={
          selectedId ? (
            <ConfigurationProvider
              id={selectedId}
              modules={modules}
              onModuleUpdate={handleModuleUpdate}
            />
          ) : (
            <Modules modules={modulesList} />
          )
        }
        onClose={onClose}
      >
        <GridProvider
          isEditing
          modules={modules}
          selectedId={selectedId}
          onModuleClick={setSelectedId}
          onChange={handleGridChange}
        />
      </Editor>
    </GrillProvider>
  )
}

function ConfigurationProvider({ id, modules, onModuleUpdate }) {
  const module = modules?.find(m => m.id === id)

  const components = useMemo(() => {
    const wrap = Component =>
      form.populateField(Component, (...args) => onModuleUpdate(id, ...args))

    return {
      Form: form.SetupProvider,
      Input: wrap(Input),
      Select: wrap(Select),
      Checkbox: wrap(Checkbox),
    }
  }, [id])

  const Component = modulesDict[module.type].Configuration

  return !module ? (
    "Loading..."
  ) : (
    <Configuration>
      <form.ValuesProvider values={module.config}>
        <Component
          key={module.id}
          config={module.config}
          components={components}
        />
      </form.ValuesProvider>
    </Configuration>
  )
}

function GridProvider({
  modules,
  isEditing,
  selectedId,
  onChange,
  onModuleClick,
}) {
  const layout = modules && createLayout(modules)

  return !layout ? (
    "Loading..."
  ) : (
    <Grid
      layout={layout}
      isEditable={isEditing}
      onChange={onChange}
      renderItem={module => (
        <Module
          key={module.id}
          isEditable={isEditing}
          isSelected={isEditing && selectedId === module.id}
          data={module}
          expression={expression}
          component={modulesDict[module.type].Root}
          onClick={onModuleClick}
        />
      )}
    />
  )
}
