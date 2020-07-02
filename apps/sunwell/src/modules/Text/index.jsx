import React from "react"
import { mergeRight } from "ramda"
import { Formik, Form, Field } from "formik"
import * as yup from "yup"
import * as system from "@sourceface/style"
import styles from "./index.scss"

// every module should have correspoding loader(depending on type)
function TextModule({ config, e: Expression }) {
  return (
    <span
      className={styles.root}
      style={{
        fontSize: system.fontSizes[config.size],
        fontWeight: system.fontWeights[config.fontWeight],
        textAlign: config.alignmentX,
        verticalAlign: config.alignmentY,
        textDecoration: config.decoration,
        color: config.color,
      }}
    >
      <Expression input={config.value} />
    </span>
  )
}

TextModule.moduleName = "text"

TextModule.Configuration = function TextModuleConfiguration({
  config,
  elements,
}) {
  return (
    <Formik
      initialValues={mergeRight(
        {
          value: "",
          size: system.fontSizes.lg,
          fontWeight: system.fontWeights.regular,
          alignmentX: "left",
          alignmentY: "baseline",
          decoration: "none",
          color: "#000",
        },
        config
      )}
      validationSchema={TextModule.validationSchema}
    >
      <Form>
        <elements.Form defaultValues={{ color: "#ddd" }}>
          <elements.Input type="text" name="color" />
        </elements.Form>

        <div>
          <div>
            <b>Text</b>
          </div>
          <Field name="value" component="input" />
        </div>
        <br />
        <div>
          <div>
            <b>Size</b>
          </div>
          <Field name="size" component="select">
            {Object.keys(system.fontSizes).map(size => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </Field>
        </div>
        <br />
        <div>
          <div>
            <b>Font weight</b>
          </div>
          <Field name="fontWeight" component="select">
            {Object.keys(system.fontWeights).map(fontWeight => (
              <option key={fontWeight} value={fontWeight}>
                {fontWeight}
              </option>
            ))}
          </Field>
        </div>
        <br />
        <div>
          <div>
            <b>Horizontal alignment</b>
          </div>
          <Field name="alignmentX" component="select">
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </Field>
        </div>
        <br />
        <div>
          <div>
            <b>Vertical alignment</b>
          </div>
          <Field name="alignmentY" component="select">
            <option value="baseline">Baseline</option>
            <option value="top">Top</option>
            <option value="middle">Middle</option>
            <option value="bottom">Bottom</option>
          </Field>
        </div>
        <br />
        <div>
          <div>
            <b>Decoration</b>
          </div>
          <Field name="decoration" component="select">
            <option value="none">None</option>
            <option value="underline">Underline</option>
            <option value="strikethrough">Strikethrough</option>
          </Field>
        </div>
        <br />
        <div>
          <div>
            <b>Color</b>
          </div>
          <Field name="color" component="input" />
        </div>
      </Form>
    </Formik>
  )
}

// TODO: enhance validation. Instead of string, on select fields have oneOf
TextModule.validationSchema = yup.object().shape({
  value: yup.string().required(),
  size: yup.string().required(),
  fontWeight: yup.number().required(),
  alignmentX: yup.string().required(),
  alignmentY: yup.string().required(),
  decoration: yup.string().required(),
  color: yup.string().required(),
})

export default TextModule
