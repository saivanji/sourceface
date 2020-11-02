import React, { createContext, useState } from "react"

const context = createContext()

export default ({ children, modules: cached }) => {
  const [modules, setModules] = useState(cached)
  const [selectedId, setSelectedId] = useState(null)

  const selected = selectedId && modules.find((m) => m.id === selectedId)

  function select(moduleId) {
    setSelectedId(moduleId)
  }

  function createModule({ moduleId, type, config, position }) {
    const module = {
      id: moduleId,
      type,
      // TODO: provide defaultConfig here
      config,
      // TODO: create name
      name: "",
      // TODO: remove
      positionId: -1,
    }

    setModules((modules) => [...modules, { moduleId, type, config }])
  }

  return (
    <context.Provider value={{ modules, selected, select, createModule }}>
      {children}
    </context.Provider>
  )
}
