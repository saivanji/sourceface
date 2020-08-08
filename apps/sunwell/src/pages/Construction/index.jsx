// order creation will be in a modal

import React, { createContext, useState, useMemo } from "react"
import { values } from "ramda"
import { useQuery, useMutation } from "urql"
import { GrillProvider } from "packages/grid"
import * as stockModules from "packages/modules"
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

const stockModulesDict = transformModules(stockModules)
const stockModulesList = values(stockModulesDict)

// TODO: move to "expression.js"
export const context = createContext({})
// TODO: think about real use case

// TODO: handle error on back-end requests
export default () => {
  const [result] = useQuery({
    query: schema.root,
    variables: { pageId: 1 },
  })
  const [isEditing, editOn, editOff] = useBooleanState(false)
  const page = result.data?.page

  return (
    <context.Provider value={result.data}>
      {isEditing ? (
        <EditorProvider page={page} onClose={editOff} />
      ) : (
        <Frame path={path} actions={<button onClick={editOn}>Edit</button>}>
          <GridProvider isEditing={false} page={page} />
        </Frame>
      )}
    </context.Provider>
  )
}

function EditorProvider({ page, onClose }) {
  const [selectedId, setSelectedId] = useState(null)
  const [, createModule] = useMutation(schema.createModule)
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
      // TODO: put all layout on creation because of the collisions(detach layout from modules and send 2 mutations - createModule and updateLayout?)
      createModule({
        type,
        config: stockModulesDict[type].defaultConfig,
        position,
      })
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
              modules={page.modules}
              onModuleUpdate={handleModuleUpdate}
            />
          ) : (
            <Modules stock={stockModulesList} />
          )
        }
        onClose={onClose}
      >
        <GridProvider
          isEditing
          page={page}
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

  const Component = stockModulesDict[module.type].Configuration

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
  page,
  isEditing,
  selectedId,
  onChange,
  onModuleClick,
}) {
  const layout = page && createLayout(page.modules, page.layout.positions)

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
          component={stockModulesDict[module.type].Root}
          onClick={onModuleClick}
        />
      )}
    />
  )
}
