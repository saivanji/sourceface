import React, { createContext, useContext, useState } from "react"
import { ValidationError } from "yup"
import { context as configContext } from "./Configuration"

const context = createContext({})

export default function Form({ validationSchema, children }) {
  const values = useContext(configContext)

  return (
    <context.Provider value={{ values, validationSchema }}>
      {children}
    </context.Provider>
  )
}

export function Field({ name, onChange, component: Component, ...props }) {
  const { values, validationSchema } = useContext(context)
  const [error, setError] = useState(null)
  const value = values[name]

  return (
    <Component
      {...props}
      style={{ width: "100%" }}
      error={error?.message}
      value={error?.value ?? value}
      onChange={event => {
        try {
          const { value } = event.target
          validationSchema.fields[name].validateSync(value)
          setError(null)
          onChange(name, value)
        } catch (err) {
          if (!(err instanceof ValidationError)) throw err
          setError(err)
        }
      }}
    />
  )
}

export const populateField = (Component, onChange) => ({ name, ...props }) => (
  <Field {...props} name={name} component={Component} onChange={onChange} />
)
