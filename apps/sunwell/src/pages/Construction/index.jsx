// order creation will be in a modal

import React, { createContext, useState, useMemo, useContext } from "react"
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
  toPositionsRequest,
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
const editorContext = createContext({})

// TODO: handle error on back-end requests
export default () => {
  // TODO: query should not be executed again after layout updated
  const [result] = useQuery({
    query: schema.root,
    variables: { pageId: 1 },
  })
  const [isEditing, editOn, editOff] = useBooleanState(false)
  const page = result.data?.page
  const layout =
    page && createLayout(page.layout.id, page.modules, page.layout.positions)

  const children = !layout ? "Loading..." : <ModulesProvider layout={layout} />

  return (
    <context.Provider value={result.data}>
      {isEditing ? (
        <EditorProvider modules={page?.modules} onClose={editOff}>
          {children}
        </EditorProvider>
      ) : (
        <Frame path={path} actions={<button onClick={editOn}>Edit</button>}>
          {children}
        </Frame>
      )}
    </context.Provider>
  )
}

function EditorProvider({ children, modules, onClose }) {
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

      // TODO: implement optimistic updates
      createModule({
        type: moduleType,
        config: stockModulesDict[moduleType].defaultConfig,
        position,
        positions: toPositionsRequest(layoutId, layout),
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
              modules={modules}
              onUpdate={handleModuleUpdate}
              onRemove={handleModuleRemove}
            />
          ) : (
            <Modules stock={stockModulesList} />
          )
        }
        onClose={onClose}
      >
        <editorContext.Provider
          value={{
            isEditing: true,
            selectedId,
            onModuleClick: setSelectedId,
            onChange: handleGridChange,
          }}
        >
          {children}
        </editorContext.Provider>
      </Editor>
    </GrillProvider>
  )
}

function ConfigurationProvider({ id, modules, onUpdate, onRemove }) {
  const module = modules && findModule(id, modules)

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

function ModulesProvider({ layout }) {
  const { isEditing, selectedId, onChange, onModuleClick } = useContext(
    editorContext
  )

  const handleChange = event => onChange(event, layout.id)
  const components = {
    Modules: ModulesProvider,
  }

  return (
    <Grid
      layout={layout.positions}
      isEditable={isEditing}
      onChange={handleChange}
      renderItem={module => (
        <Module
          key={module.id}
          isEditable={isEditing}
          isSelected={isEditing && selectedId === module.id}
          data={module}
          expression={expression}
          components={components}
          component={stockModulesDict[module.type].Root}
          onClick={onModuleClick}
        />
      )}
    />
  )
}
