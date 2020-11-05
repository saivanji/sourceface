import React from "react"
import * as yup from "yup"
import { Row, Label, Input } from "@sourceface/components"
import { useTransition } from "packages/factory"
import { Field } from "packages/toolkit"

export const Root = function InputModule({
  config,
  state: { value, validationError, isJustified },
}) {
  // TODO: additionally `useTransition()`, in order to be able to use `transition({value, validationError})` to
  // set multiple fields at once.
  const transitionValue = useTransition("value")
  const transitionValidationError = useTransition("validationError")

  const handleChange = (e) => {
    const { value: currentValue } = e.target
    const error =
      config.validation &&
      (validate(config.validation, currentValue) || config.validationMessage)

    transitionValidationError((isJustified && error) || null)
    transitionValue(currentValue)
  }

  return (
    <div>
      <Input
        value={value}
        onChange={handleChange}
        placeholder={config.placeholder}
      />
      <div>{validationError}</div>
    </div>
  )
}

export const Configuration = function InputModuleConfiguration() {
  return (
    <>
      <Row>
        <Label title="Placeholder">
          <Field name="placeholder" type="text" component={Input} />
        </Label>
      </Row>
      <Row>
        <Label title="Validation">
          <Field name="validation" type="text" component={Input} />
        </Label>
      </Row>
      <Row>
        <Label title="Validation message">
          <Field name="validationMessage" type="text" component={Input} />
        </Label>
      </Row>
    </>
  )
}

export const createLocalVariables = (config, state, transition) => ({
  value: state.value,
  // TODO: alternative name is "release"?
  // TODO: return "Action" type, or better wrap in Action(purify) internally.
  justify: () => {
    transition("isJustified", true)

    if (config.validation && !validate(config.validation, state.value)) {
      // TODO: transition({validationError: message}) in order to be able set multiple state fields at once
      transition("validationError", config.validationMessage)

      throw new Error(config.validationMessage)
    }

    return state.value
  },
})

export const defaultConfig = {
  validationMessage: "Validation failed",
}

export const initialState = {
  value: "",
}

export const validationSchema = yup.object().shape({
  placeholder: yup.string(),
  validation: yup.string(),
  validationMessage: yup.string(),
})

export const size = {
  w: 4,
  h: 1,
}

const validate = (pattern, value) => {
  const regexp = new RegExp(pattern)

  return regexp.test(value)
}
