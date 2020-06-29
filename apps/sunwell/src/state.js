import React, { useState, createContext } from "react"

export const context = createContext({})

export const Provider = ({ children }) => {
  const [isEditing, setEditing] = useState(false)

  return (
    <context.Provider
      value={{
        isEditing,
        enableEditMode: () => setEditing(true),
        disableEditMode: () => setEditing(false),
      }}
    >
      {children}
    </context.Provider>
  )
}
