import React from "react"
import { Input, Button, Select, Checkbox } from "@sourceface/components"
import * as yup from "yup"
import { useHandlers } from "packages/factory"
import { Option } from "packages/toolkit"

export const Root = function ButtonModule({
  data: [shouldFitContainer, size, text],
}) {
  const [onClick] = useHandlers("action")

  return (
    <Button
      shouldFitContainer={shouldFitContainer}
      size={size}
      onClick={() => onClick({ foo: "bar" })}
    >
      {text}
    </Button>
  )
}

Root.data = ["shouldFitContainer", "size", "text"]

// TODO: have "isSpinning" field to display loading state for a button.
// That might be useful in combination with using actions for that field(when we set that value
// to truthy when we have data of specific operation populated and that operation is triggered
// also by that button. Use case of opening a modal of editing the order)

export const Configuration = function ButtonModuleConfiguration() {
  return (
    <>
      <Option name="text" label="Text" type="text" component={Input} />
      <Option
        name="size"
        label="Size"
        items={optionsProps.sizes}
        component={Select}
      />
      <Option name="action" label="Action" actionsOnly />
      <Option
        name="shouldFitContainer"
        label="Fits container"
        text="Yes"
        component={Checkbox}
      />
    </>
  )
}

const options = {
  sizes: {
    small: "Small",
    regular: "Regular",
    large: "Large",
  },
}

const optionsProps = Object.keys(options).reduce(
  (acc, name) => ({
    ...acc,
    [name]: Object.keys(options[name]).map((key) => ({
      value: key,
      title: options[name][key],
    })),
  }),
  {}
)

export const defaults = {
  text: "Click me",
  size: "regular",
  shouldFitContainer: false,
}

export const validationSchema = yup.object().shape({
  text: yup.string().required(),
  size: yup.string().required(),
  action: yup.array().of(yup.string()),
  shouldFitContainer: yup.boolean().required(),
})

export const size = {
  w: 3,
  h: 1,
}

export const definitions = {
  action: ["foo"],
}
