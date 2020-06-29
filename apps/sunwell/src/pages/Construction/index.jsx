// order creation will be in a modal

import React, {
  createElement,
  createContext,
  useContext,
  useState,
  useMemo,
} from "react"
import { useQuery } from "urql"
import { Text, Table } from "modules/index"
import { Frame, Editor, Module, When } from "components/index"
import * as state from "state.js"
import Expression from "./Expression"
import * as schema from "./schema"

// TODO: read about suspence, data fetching, recoil

/* <div className={styles.panel}> */
/*   <span className={styles.title}>Orders</span> */
/*   <Button className={styles.newOrder}>New order</Button> */
/* </div> */

export const context = createContext({})

export default () => {
  const [result] = useQuery({
    query: schema.root,
  })
  const { isEditing, enableEditMode, disableEditMode } = useContext(
    state.context
  )

  return (
    <When
      cond={!isEditing}
      component={Frame}
      path={[
        { title: "Administration", link: "#" },
        { title: "Users", link: "#" },
      ]}
      actions={<button onClick={enableEditMode}>Edit</button>}
    >
      <>
        {!result.data ? (
          "Page is loading..."
        ) : (
          <context.Provider value={result.data}>
            <Body
              modules={result.data.modules}
              isEditing={isEditing}
              onEditorCancel={disableEditMode}
            />
          </context.Provider>
        )}
      </>
    </When>
  )
}

const Body = ({ modules, isEditing, onEditorCancel }) => {
  const [selectedModuleId, setSeletedModuleId] = useState()
  const selectedModule = useMemo(() => {
    const module = modules.find(m => m.id === selectedModuleId)

    return (
      module &&
      createElement(modulesMap[module.type].Configuration, {
        key: module.id,
        config: module.config,
      })
    )
  }, [modules, selectedModuleId])

  return (
    <When
      cond={isEditing}
      component={Editor}
      selectedModule={selectedModule}
      onCancel={onEditorCancel}
    >
      {modules.map(module => (
        <When
          cond={isEditing}
          component={Module}
          key={module.id}
          isSelected={selectedModuleId === module.id}
          onClick={() => setSeletedModuleId(module.id)}
        >
          {createElement(modulesMap[module.type], {
            config: module.config,
            e: Expression,
          })}
        </When>
      ))}
    </When>
  )
}

const modulesMap = {
  text: Text,
  table: Table,
}
