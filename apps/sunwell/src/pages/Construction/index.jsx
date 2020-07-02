// order creation will be in a modal

import React, {
  createElement,
  createContext,
  useState,
  useMemo,
  useCallback,
} from "react"
import { useQuery } from "urql"
import { mergeRight } from "ramda"
import { useBooleanState } from "hooks/index"
import { Text, Table } from "modules/index"
import { Frame, Editor, Module } from "components/index"
import * as kit from "packages/kit"
import Expression from "./Expression"
import * as schema from "./schema"
import Form, { populateField } from "./Form"

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
  const configuration = useConfiguration(selectedModuleId, result.data?.modules)

  const Parent = isEditing ? Editor : Frame
  return Parent.renderRoot(
    <>
      {!isEditing ? (
        <Frame.Elements
          path={path}
          actions={<button onClick={enableEditing}>Edit</button>}
        />
      ) : (
        <Editor.Elements configuration={configuration} onClose={closeEditor} />
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

// have separate name for modules and their configurations
// rename selectedModule to the configuration?
const useConfiguration = (id, modules) => {
  return useMemo(() => {
    // not good since we spread main render details to another function
    // probably create Configuration(in a separate file here) component and use these hooks inside of that component in order to solve that
    if (!modules || !id) return

    const module = modules.find(m => m.id === id)
    const onSave = (name, value) => console.log(id, name, value)

    const components = {
      elements: {
        // automatically merge config data with values or not? Probably no, since we do not need to replace input value with previous one on optimistic update failure
        Form: props =>
          createElement(Form, {
            ...props,
            values: mergeRight(props.defaultValues, module.config),
          }),
        Input: populateField(kit.Input, onSave),
      },
    }

    return createElement(modulesMap[module.type].Configuration, {
      key: module.id,
      config: module.config,
      ...components,
    })
  }, [id, modules])
}

const modulesMap = {
  text: Text,
  table: Table,
}
