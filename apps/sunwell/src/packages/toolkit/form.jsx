import React, { createContext, useContext, useState } from "react"
import { ValidationError } from "yup"

const context = createContext({})

export function Form({ children, config, validationSchema, onConfigChange }) {
  return (
    <context.Provider value={{ config, validationSchema, onConfigChange }}>
      {children}
    </context.Provider>
  )
}

// TODO: use Option view component here
export function Field({ name, component: Component, ...props }) {
  const { config, validationSchema, onConfigChange } = useContext(context)
  const [error, setError] = useState(null)
  const value = config[name]

  return (
    <Component
      {...props}
      style={{ width: "100%" }}
      error={error?.message}
      value={error?.value ?? value}
      onChange={event => {
        try {
          const { value } = event.target
          validationSchema.fields[name]?.validateSync(value)
          setError(null)
          onConfigChange(name, value)
        } catch (err) {
          if (!(err instanceof ValidationError)) throw err
          setError(err)
        }
      }}
    />
  )
}
