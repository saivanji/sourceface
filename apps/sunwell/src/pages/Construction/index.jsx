// order creation will be in a modal

import React, {
  createElement,
  createContext,
  useState,
  useMemo,
  useCallback,
} from "react"
import { useQuery } from "urql"
import { useBooleanState } from "hooks/index"
import { Text, Table } from "packages/modules"
import { Frame, Editor, Module } from "components/index"
import Configuration from "./Configuration"
import * as fetching from "./fetching"
import * as schema from "./schema"

/* <div className={styles.panel}> */
/*   <span className={styles.title}>Orders</span> */
/*   <Button className={styles.newOrder}>New order</Button> */
/* </div> */

const path = [
  { title: "Administration", link: "#" },
  { title: "Users", link: "#" },
]

export const context = createContext({})

// TODO: handle error on back-end requests
export default () => {
  const [result] = useQuery({
    query: schema.root,
  })
  const [isEditing, enableEditing, disableEditing] = useBooleanState(false)
  const [selectedModuleId, setSeletedModuleId] = useState()
  const closeEditor = useCallback(() => {
    disableEditing()
    setSeletedModuleId(null)
  }, [disableEditing, setSeletedModuleId])
  const editModule = useCallback(id => isEditing && setSeletedModuleId(id), [
    isEditing,
    setSeletedModuleId,
  ])
  const selectedModule = useMemo(
    () => result.data?.modules.find(m => m.id === selectedModuleId),
    [result.data?.modules, selectedModuleId]
  )
  const Parent = isEditing ? Editor : Frame

  return Parent.renderRoot(
    <>
      {!isEditing ? (
        <Frame.Elements
          path={path}
          actions={<button onClick={enableEditing}>Edit</button>}
        />
      ) : (
        <Editor.Elements
          isLoadingModules={!result.data}
          configuration={
            selectedModule && (
              <Configuration
                module={selectedModule}
                component={modulesMap[selectedModule.type].Configuration}
              />
            )
          }
          onClose={closeEditor}
        />
      )}
      {!result.data
        ? "Page is loading..."
        : Parent.renderChildren(
            <context.Provider value={result.data}>
              {result.data.modules.map(module => (
                <Module
                  key={module.id}
                  isEditable={isEditing}
                  isSelected={isEditing && selectedModuleId === module.id}
                  data={module}
                  onClick={editModule}
                  fetching={fetching}
                  component={modulesMap[module.type]}
                />
              ))}
            </context.Provider>
          )}
    </>
  )
}

const modulesMap = {
  text: Text,
  table: Table,
}
