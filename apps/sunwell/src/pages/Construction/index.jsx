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
import { Text, Table } from "modules/index"
import { Frame, Editor, Module } from "components/index"
import Expression from "./Expression"
import * as schema from "./schema"

// TODO: read about suspence, data fetching, recoil

/* <div className={styles.panel}> */
/*   <span className={styles.title}>Orders</span> */
/*   <Button className={styles.newOrder}>New order</Button> */
/* </div> */

const path = [
  { title: "Administration", link: "#" },
  { title: "Users", link: "#" },
]

export const context = createContext({})

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
    () => renderSelectedModule(selectedModuleId, result.data?.modules),
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
          selectedModule={selectedModule}
          onCancel={closeEditor}
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
                  expression={Expression}
                  component={modulesMap[module.type]}
                />
              ))}
            </context.Provider>
          )}
    </>
  )
}

const renderSelectedModule = (id, modules) => {
  const module = modules?.find(m => m.id === id)

  return (
    module &&
    createElement(modulesMap[module.type].Configuration, {
      key: module.id,
      config: module.config,
    })
  )
}

const modulesMap = {
  text: Text,
  table: Table,
}
