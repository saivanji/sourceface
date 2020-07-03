import React, { createElement, useMemo, useCallback } from "react"
import { mergeRight } from "ramda"
import * as kit from "packages/kit"
import Form, { populateField } from "./Form"

export default function Configuration({ module, component: Component }) {
  const onSave = useCallback(
    (name, value) => console.log(module.id, name, value),
    [module.id]
  )
  const components = useMemo(
    () => ({
      // automatically merge config data with values or not? Probably no, since we do not need to replace input value with previous one on optimistic update failure
      Form: props =>
        createElement(Form, {
          ...props,
          values: mergeRight(props.defaultValues, module.config),
        }),
      Input: populateField(kit.Input, onSave),
      Select: populateField(kit.Select, onSave),
      Label: kit.Label,
      Row: kit.Row,
    }),
    [module.config, onSave]
  )

  return (
    <Component key={module.id} config={module.config} components={components} />
  )
}
