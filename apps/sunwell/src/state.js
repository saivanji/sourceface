import React, { useState, createContext } from "react"

export const context = createContext({})

export const Provider = ({ children }) => {
  const [isEditing, setEditing] = useState(false)

  return (
    <context.Provider
      value={{
        isEditing,
        enableEditMode: () => setEditing(true),
      }}
    >
      {children}
    </context.Provider>
  )
}
