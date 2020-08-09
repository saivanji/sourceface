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
import {
  createLayout,
  layoutToPositions,
  transformModules,
  findModule,
} from "./utils"

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
  // TODO: query should not be executed again after layout updated
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
  const handleModuleUpdate = (id, key, value) =>
    updateModule({ moduleId: id, key, value })

  const handleModuleRemove = id => removeModule({ moduleId: id })

  const handleGridChange = event => {
    if (["leave", "drag", "resize"].includes(event.name)) {
      // TODO: in case of "leave" - push input value to context, so in future it can be combined with "enter" input and sent to server
      updatePositions({
        positions: layoutToPositions(page.layout.id, event.layout),
      })
      return
    }

    if (event.name === "enter" && event.sourceType === "outer") {
      const { moduleType } = event.transfer
      const { outer, ...layout } = event.layout
      const position = { layoutId: page.layout.id, ...outer }

      // TODO: implement optimistic updates
      createModule({
        type: moduleType,
        config: stockModulesDict[moduleType].defaultConfig,
        position,
        positions: layoutToPositions(page.layout.id, layout),
      })
    }
  }

  return (
    <GrillProvider>
      <Editor
        isSaving={isUpdatingGrid || isUpdatingModule || isRemovingModule}
        right={
          selectedId ? (
            <ConfigurationProvider
              id={selectedId}
              page={page}
              onUpdate={handleModuleUpdate}
              onRemove={handleModuleRemove}
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

function ConfigurationProvider({ id, page, onUpdate, onRemove }) {
  const module = page && findModule(id, page.layout.positions)

  const handleRemove = () => onRemove(id)

  const components = useMemo(() => {
    const wrap = Component =>
      form.populateField(Component, (...args) => onUpdate(id, ...args))

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
    <Configuration onRemove={handleRemove}>
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
  const layout = page && createLayout(page.layout.positions)

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
