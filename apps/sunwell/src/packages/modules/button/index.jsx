import React from "react"
import {
  Row,
  Label,
  Input,
  Button,
  Select,
  Checkbox,
} from "@sourceface/components"
import * as yup from "yup"
import { useHandler } from "packages/factory"
import { Field, Pipe } from "packages/toolkit"

export const Root = function ButtonModule({ config }) {
  const [onClick] = useHandler(config.action)

  return (
    <Button
      shouldFitContainer={config.shouldFitContainer}
      size={config.size}
      onClick={onClick}
    >
      {config.text}
    </Button>
  )
}

// TODO: have "isSpinning" field to display loading state for a button.
// That might be useful in combination with using actions for that field(when we set that value
// to truthy when we have data of specific operation populated and that operation is triggered
// also by that button. Use case of opening a modal of editing the order)

export const Configuration = function ButtonModuleConfiguration() {
  return (
    <>
      <Row>
        <Label title="Text">
          <Field name="text" type="text" component={Input} />
        </Label>
      </Row>
      <Row>
        <Label title="Size">
          <Field name="size" items={optionsProps.sizes} component={Select} />
        </Label>
      </Row>
      <Row>
        <Label title="Action">
          <Field name="action" component={Pipe} />
        </Label>
      </Row>
      <Row>
        <Field
          name="shouldFitContainer"
          label="Fits container"
          component={Checkbox}
        />
      </Row>
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

export const defaultConfig = {
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
