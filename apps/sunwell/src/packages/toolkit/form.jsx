// Consider moving to a separate place
import React, { createContext, useContext, useState } from "react"
import { ValidationError } from "yup"

const setupContext = createContext({})
const valuesContext = createContext({})

export function SetupProvider({ children, validationSchema }) {
  return (
    <setupContext.Provider value={{ validationSchema }}>
      {children}
    </setupContext.Provider>
  )
}

// TODO: rename to ConfigProvider
// values -> config
// onChange
export function ValuesProvider({ children, values }) {
  return (
    <valuesContext.Provider value={values}>{children}</valuesContext.Provider>
  )
}

export function Field({ name, onChange, component: Component, ...props }) {
  const values = useContext(valuesContext)
  const { validationSchema } = useContext(setupContext)
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
