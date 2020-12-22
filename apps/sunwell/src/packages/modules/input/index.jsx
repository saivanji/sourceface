import React from "react"
import * as yup from "yup"
import { Input } from "@sourceface/components"
import { useTransition } from "packages/factory"
import { Option } from "packages/toolkit"

export const Root = function InputModule({
  data: [initial, validation, validationMessage, placeholder],
  state: { value, validationError, isReleased },
}) {
  // TODO: handle async loading
  // TODO: additionally `useTransition()`, in order to be able to use `transition({value, validationError})` to
  // set multiple fields at once.
  const transitionValue = useTransition("value")
  const transitionValidationError = useTransition("validationError")

  const handleChange = (e) => {
    const { value: currentValue } = e.target
    const error =
      validation && (validate(validation, currentValue) || validationMessage)

    transitionValidationError((isReleased && error) || null)
    transitionValue(currentValue)
  }

  return (
    <div>
      <Input
        value={value || initial}
        onChange={handleChange}
        placeholder={placeholder}
      />
      <div>{validationError}</div>
    </div>
  )
}

Root.data = ["initial", "validation", "validationMessage", "placeholder"]

// TODO: implement combined field for having regular form element and Pipe
export const Configuration = function InputModuleConfiguration() {
  return (
    <>
      <Option
        name="placeholder"
        label="Placeholder"
        type="text"
        component={Input}
      />
      <Option
        name="validation"
        label="Validation"
        type="text"
        component={Input}
      />
      <Option
        name="validationMessage"
        label="Validation message"
        type="text"
        component={Input}
      />
      <Option name="initial" label="Initial value" actionsOnly />
    </>
  )
}

export const scope = {
  value: (state) => state.value,
}

export const functions = {
  release: (validation, validationMessage, state, transition) => {
    transition("isReleased", true)

    if (validation && !validate(validation, state.value)) {
      // TODO: transition({validationError: message}) in order to be able set multiple state fields at once
      transition("validationError", validationMessage)

      throw new Error(validationMessage)
    }

    return state.value
  },
}

export const dependencies = {
  functions: {
    release: ["validation", "validationMessage"],
  },
}

export const createScope = (data, state) => ({
  value: state.value,
})

export const createFunctions = (data, state, transition) => ({
  release: () => {
    transition("isReleased", true)

    if (data.validation && !validate(data.validation, state.value)) {
      // TODO: transition({validationError: message}) in order to be able set multiple state fields at once
      transition("validationError", data.validationMessage)

      throw new Error(data.validationMessage)
    }

    return state.value
  },
})

export const defaults = {
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
