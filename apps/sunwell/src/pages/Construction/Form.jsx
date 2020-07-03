import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react"
import * as yup from "yup"

const context = createContext({})

// using values instead of initial values since because of optimistic update failure we need to restore form state from the outside
export default function Form({ values, validationSchema, children }) {
  // TODO: most likely don't need to keep the state at all in favor of optimistic updates
  const [currentValues, setValues] = useState(values)
  const updateValue = useCallback(
    (name, value) => setValues({ ...currentValues, [name]: value }),
    [currentValues]
  )

  useEffect(() => {
    setValues(values)
  }, [values])

  return (
    <context.Provider
      value={{ values: currentValues, validationSchema, updateValue }}
    >
      {children}
    </context.Provider>
  )
}

export function Field({ name, onChange, component: Component, ...props }) {
  const { values, validationSchema, updateValue } = useContext(context)
  const value = values[name]

  return (
    <Component
      {...props}
      value={value}
      onChange={event => {
        // console.log(validationSchema.fields[name].validateSync(value))

        updateValue(name, event.target.value)
        // check whether field was touched
        onChange && onChange(name, event.target.value)
      }}
    />
  )
}

export const populateField = (Component, onChange) => ({ name, ...props }) => (
  <Field {...props} name={name} component={Component} onChange={onChange} />
)
