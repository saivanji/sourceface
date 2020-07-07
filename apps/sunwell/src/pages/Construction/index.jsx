// order creation will be in a modal

import React, {
  createElement,
  createContext,
  useState,
  useMemo,
  useCallback,
} from "react"
import { useQuery, useMutation } from "urql"
import { keys, values } from "ramda"
import camelCase from "camelcase"
import { useBooleanState } from "hooks/index"
import { Frame, Editor, Module, Grid } from "components/index"
import * as modules from "packages/modules"
import * as expression from "./expression"
import * as schema from "./schema"
import Configuration from "./Configuration"

/* <div className={styles.panel}> */
/*   <span className={styles.title}>Orders</span> */
/*   <Button className={styles.newOrder}>New order</Button> */
/* </div> */

const path = [
  { title: "Administration", link: "#" },
  { title: "Users", link: "#" },
]

export const context = createContext({})
// TODO: think about real use case

// TODO: handle error on back-end requests
export default () => {
  const [result] = useQuery({
    query: schema.root,
  })
  const [, addModule] = useMutation(schema.addModule)
  const [isEditing, enableEditing, disableEditing] = useBooleanState(false)
  const [selectedModuleId, setSeletedModuleId] = useState()
  const onCloseEditor = useCallback(() => {
    disableEditing()
    setSeletedModuleId(null)
  }, [disableEditing, setSeletedModuleId])
  const onModuleClick = useCallback(id => isEditing && setSeletedModuleId(id), [
    isEditing,
    setSeletedModuleId,
  ])
  const onAddModule = useCallback(
    type => addModule({ type, config: modulesMap[type].defaultValues }),
    []
  )
  const selectedModule = useMemo(
    () => result.data?.modules.find(m => m.id === selectedModuleId),
    [result.data?.modules, selectedModuleId]
  )
  const Parent = isEditing ? Editor : Frame
  const availableModules = useMemo(() => values(modules), [])

  return Parent.renderRoot(
    <>
      {!isEditing ? (
        <Frame.Elements
          path={path}
          actions={<button onClick={enableEditing}>Edit</button>}
        />
      ) : (
        <Editor.Elements
          availableModules={availableModules}
          isLoadingModules={!result.data}
          configuration={
            selectedModule && (
              <Configuration
                module={selectedModule}
                component={modulesMap[selectedModule.type].Configuration}
              />
            )
          }
          onClose={onCloseEditor}
          onAddModule={onAddModule}
        />
      )}
      {!result.data
        ? "Page is loading..."
        : Parent.renderChildren(
            <context.Provider value={result.data}>
              <Grid
                isEditable={isEditing}
                items={result.data.modules}
                renderItem={module => (
                  <Module
                    key={module.id}
                    isEditable={isEditing}
                    isSelected={isEditing && selectedModuleId === module.id}
                    data={module}
                    expression={expression}
                    component={modulesMap[module.type]}
                    onClick={onModuleClick}
                  />
                )}
              ></Grid>
            </context.Provider>
          )}
    </>
  )
}

const modulesMap = keys(modules).reduce((acc, key) => {
  const Module = modules[key]

  Module.type = camelCase(key)

  return {
    ...acc,
    [Module.type]: Module,
  }
}, {})
