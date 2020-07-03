import React, { createContext, useContext } from "react"
import { mergeRight } from "ramda"
import { context as configContext } from "./Configuration"

const context = createContext({})

export default function Form({ defaultValues, validationSchema, children }) {
  const config = useContext(configContext)
  const values = mergeRight(defaultValues, config)

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
