import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react"

const context = createContext({})

// using values instead of initial values since because of optimistic update failure we need to restore form state from the outside
export default function Form({ values, validationSchema, children }) {
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

export function Field({ name, onBlur, component: Component }) {
  const { values, validationSchema, updateValue } = useContext(context)
  const value = values[name]

  return (
    <Component
      value={value}
      onChange={event => updateValue(name, event.target.value)}
      onBlur={event => {
        // check whether field was touched
        onBlur(name, event.target.value)
      }}
    />
  )
}

export const populateField = (Component, onBlur) => ({ name, ...props }) => (
  <Field {...props} name={name} onBlur={onBlur} component={Component} />
)
