import React from "react"
import { Row, Label, Input } from "@sourceface/components"
import { Form, Field, useTransition } from "packages/toolkit"
import * as yup from "yup"

export const Root = function InputModule({ config, state }) {
  const handleChange = useTransition("value")

  return (
    <Input
      value={state.value}
      onChange={e => handleChange(e.target.value)}
      placeholder={config.placeholder}
    />
  )
}

export const Configuration = function InputModuleConfiguration({
  config,
  onConfigChange,
}) {
  return (
    <Form
      config={config}
      onConfigChange={onConfigChange}
      validationSchema={validationSchema}
    >
      <Row>
        <Label title="Placeholder">
          <Field name="placeholder" type="text" component={Input} />
        </Label>
      </Row>
    </Form>
  )
}

export const createLocalVariables = (config, state) => ({
  value: state.value,
})

export const defaultConfig = {}

export const initialState = {
  value: "",
}

export const validationSchema = yup.object().shape({
  placeholder: yup.string(),
})

export const size = {
  w: 4,
  h: 1,
}
