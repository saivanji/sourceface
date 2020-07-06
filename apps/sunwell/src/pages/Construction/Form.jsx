import React, { createContext, useContext } from "react"
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
  const value = values[name]

  return (
    <Component
      {...props}
      style={{ width: "100%" }}
      value={value}
      onChange={event => {
        // console.log(validationSchema.fields[name].validateSync(value))
        onChange(name, event.target.value)
      }}
    />
  )
}

export const populateField = (Component, onChange) => ({ name, ...props }) => (
  <Field {...props} name={name} component={Component} onChange={onChange} />
)
