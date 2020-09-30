import React from "react"
import {
  Row,
  Label,
  Input,
  Button,
  Select,
  Checkbox,
} from "@sourceface/components"
import { Form, Field, Expression, useComputation } from "packages/toolkit"
import * as yup from "yup"

export const Root = function ButtonModule({ config }) {
  const [onClick] = useComputation(config.action)

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

export const Configuration = function ButtonModuleConfiguration({
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
          <Field name="action" component={Expression} />
        </Label>
      </Row>
      <Row>
        <Field
          name="shouldFitContainer"
          label="Fits container"
          component={Checkbox}
        />
      </Row>
    </Form>
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
    [name]: Object.keys(options[name]).map(key => ({
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
