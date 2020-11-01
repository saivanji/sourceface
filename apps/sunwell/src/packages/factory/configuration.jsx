import React, { createContext, useContext, useState } from "react"
import { ValidationError } from "yup"
import { useMutation, mutations } from "packages/client"
import { useContainer } from "./container"

const context = createContext({})

export function Configuration({ module }) {
  const { stock } = useContainer()
  const Component = stock.modules.dict[module.type].Configuration

  return (
    <context.Provider
      value={{
        // or pass config?
        module,
      }}
    >
      <Component config={module.config} />
    </context.Provider>
  )
}

export function Form({ children, validationSchema }) {
  const parent = useContext(context)

  return (
    <context.Provider value={{ ...parent, validationSchema }}>
      {children}
    </context.Provider>
  )
}

// TODO: use Option view component here(most likely Option component is not needed. Check Option component
// definition for further info)
// TODO: have avility to "pipe" every option(have braces icon in the right side of every label).
// Or most likely feature of using expression to compute value of every option is reduntant,
// since for most cases values of these options are going to be customized statically instead of
// at a runtime. For example option to have the pagination available or not is rarely needed to be
// configured at a runtime.
export function Field({ name, component: Component, ...props }) {
  const [, updateModule] = useMutation(mutations.updateModule)
  const { module, validationSchema } = useContext(context)
  const [error, setError] = useState(null)
  const value = module.config[name]

  return (
    <Component
      {...props}
      style={{ width: "100%" }}
      error={error?.message}
      value={error?.value ?? value}
      onChange={(event) => {
        try {
          /**
           * In case event is SyntheticEvent then extract value, otherwise treat first
           * argument as value.
           */
          const value =
            event.constructor.name === "SyntheticEvent"
              ? event.target.value
              : event
          validationSchema.fields[name]?.validateSync(value)
          setError(null)

          return updateModule({ moduleId: module.id, key: name, value })
        } catch (err) {
          if (!(err instanceof ValidationError)) throw err
          setError(err)
        }
      }}
    />
  )
}

export const useConfiguration = () => {
  return useContext(context)
}
